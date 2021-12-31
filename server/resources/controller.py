from datetime import timedelta
from sqlalchemy import and_, Date, or_
from models.models import *
from flask import jsonify, request
from flask_restful import Resource
import bcrypt, random, string
from decorators import authenticate
from db import db


def errorMessage(error):
    res = {}
    res["error"] = error
    res["status"] = False
    res["code"] = 401
    return jsonify(res)


#Functionality
class Register(Resource):
    def post(self):
        data = request.get_json()
        if not data:
            return errorMessage("Invalid Request")
        if "name" in data.keys():
            name = data["name"]
        else:
            return errorMessage("Key name is required")
        if "username" in data.keys():
            username = data["username"]
            u_name_check = User.query.filter(User.username == username).first()
            if u_name_check:
                return errorMessage("Username exists")
        else:
            return errorMessage("Key username is required")
        if "phone" in data.keys():
            phone = data["phone"]
            if len(phone) < 10 or len(phone) > 10:
                return errorMessage("Mobile number should be exactly 10 digits")
            phone_check = User.query.filter(User.phone == phone).first()
            if phone_check:
                return errorMessage("User with phone number exists")
        else:
            return errorMessage("Key phone is required")
        if "password" in data.keys():
            password = data["password"]
            if len(password) < 6:
                return errorMessage("Password must be atleast 6 digits long")
            password = password.encode('utf-8')
        else:
            return errorMessage("Key password is required")
        if "email" in data.keys():
            email = data["email"]
        else:
            return errorMessage("Key email is required")
        if "profile_url" in data.keys():
            url = data["profile_url"]
        else:
            return errorMessage("Key profile_url is required")
        
        res = {}

        salt = bcrypt.gensalt(rounds=5)
        hash = bcrypt.hashpw(password, salt)
        newUser = User(name=name, username=username, password=hash.decode('utf-8'), phone=phone, email=email, profile_pic=url)
        db.session.add(newUser)
        db.session.commit()
        # token = ''.join(random.choices(string.ascii_letters + string.digits, k=32))
        # newSession = Session(authtoken=token, user_id=newUser.id)
        # db.session.add(newSession)
        # db.session.commit()
        res["error"] = ""
        res["status"] = True
        res["user"] = newUser.username
        # res["token"] = token
        resp = jsonify(res)
        return resp


class Login(Resource):
    def post(self):
        data = request.get_json()
        if not data:
            return errorMessage("Invalid Request")
        if "username" not in data.keys():
            return errorMessage("Username is required")    
        else:
            username = data["username"]
            u_name_check = User.query.filter(User.username == username).first()
            if u_name_check is None:
                return errorMessage("No such user exists")
        if "password" not in data.keys():
            return errorMessage("Password is required")
        else:
            password = data["password"]
            password = password.encode("utf-8")

        res={}
        pwd = u_name_check.password
        if bcrypt.checkpw(password, pwd.encode('utf-8')):
            token = ''.join(random.choices(string.ascii_letters + string.digits, k=32))
            newSession = Session(authtoken=token, user_id=u_name_check.id)
            db.session.add(newSession)
            db.session.commit()
            res["user"] = u_name_check.username
        else:
            return errorMessage("Password is wrong")

        res["error"] = ""
        res["status"] = True
        res["token"] = token
        resp = jsonify(res)
        return resp
        

class Logout(Resource):
    @authenticate
    def get(self, **kwargs):
        user = kwargs["user"]
        res = {}
        logout = Session.query.filter(and_(Session.user_id == user.id, Session.is_active == True)).first()
        if logout is None:
            return errorMessage("User already logged out")
        logout.is_active = False
        db.session.commit()
        res["error"] = ""
        res["status"] = True
        resp = jsonify(res)
        return resp


class BookAStation(Resource):
    @authenticate
    def get(self, id, **kwargs):
        user = kwargs["user"]
        # user = User.query.filter(id =10)
        print(user)
        res = {}
        station_check = Stations.query.filter(Stations.id == id).first()
        if station_check is None:
            return errorMessage("No such station exists")
        booking = Booking(user_id = user.id, station_id = id, status="2")
        # Set is_available = false
        # Book based on category and check if the user has a vehicle in this category
        # otp = random.choice(string.digits, k=4)
        db.session.add(booking)
        db.session.commit()
        res["booking_id"] = booking.id
        res["username"] = user.username
        res["error"] = ""
        res["status"] = True
        resp = jsonify(res)
        return resp


class ShowMyBookings(Resource):
    @authenticate
    def get(self, **kwargs):
        user = kwargs["user"]
        res = {}
        bookings = Booking.query.filter(Booking.user_id == user.id).all()
        booking_list = []
        for booking in bookings:
            book_dict = {}
            book_dict["station_id"] = booking.station_id
            bunk_name = EVBunk.query.filter(EVBunk.id == booking.stationid.vendor_id).first()
            book_dict["ev_bunk"] = bunk_name.name
            booking_list.append(book_dict)
        res["booking_list"] = booking_list
        res["error"] = ""
        res["status"] = True
        resp = jsonify(res)
        return resp


class Payment(Resource):
    @authenticate
    def get(self, b_id, **kwargs):
        user = kwargs["user"]
        res = {}
        booking_check = Booking.query.filter(Booking.id==b_id).first()
        if not booking_check:
            return errorMessage("No such booking exist")
        amount = booking_check.stationid.vendorid.cost_per_kwh
        # check if the same user who booked is paying
        # also check if user has already payed for the booking_id
        state = "success"
        if state == "success":
            payment = Payments(booking_id=b_id, amount=amount, payment_status=state, status_code=0, payment_mode="Online")
            db.session.add(payment)
            db.session.commit()
            booking_check.status = "0"
            db.session.commit()
            res["error"] = ""
            res["status"] = True
            res["amount"] = amount
            res["status"] = state
            res["payment_id"] = payment.id
            res["otp"] = random.choices(string.digits, k=4)
            res["username"] = user.username
            resp = jsonify(res)
            return resp
        else:
            payment = Payments(booking_id=b_id, amount=amount, payment_status=state, status_code=1, payment_mode="Failure")
            db.session.add(payment)
            db.session.commit()
            booking_check.status = "1"
            db.session.commit()
            res["error"] = ""
            res["status"] = True
            res["amount"] = amount
            res["payment_status"] = state
            res["payment_id"] = payment.id
            resp = jsonify(res)
            return resp


class VendorLogin(Resource):
    def post(self):
        data = request.get_json()
        if not data:
            return errorMessage("Invalid Request")
        if "username" not in data.keys():
            return errorMessage("Username is required")    
        else:
            username = data["username"]
            u_name_check = User.query.filter(User.username == username).first()
            if u_name_check is None:
                return errorMessage("No such user exists")
            vendor_check = EVBunk.query.filter(EVBunk.user_id == u_name_check.id).first()
            if vendor_check is None:
                return errorMessage("User is not a vendor")
        if "password" not in data.keys():
            return errorMessage("Password is required")
        else:
            password = data["password"]
            password = password.encode("utf-8")

        res={}
        pwd = u_name_check.password
        if bcrypt.checkpw(password, pwd.encode('utf-8')):
            token = ''.join(random.choices(string.ascii_letters + string.digits, k=32))
            newSession = Session(authtoken=token, user_id=u_name_check.id)
            db.session.add(newSession)
            db.session.commit()
            res["user"] = u_name_check.username
            res["vendor_name"] = vendor_check.name
        else:
            return errorMessage("Password is wrong")

        res["error"] = ""
        res["status"] = True
        res["token"] = token
        resp = jsonify(res)
        return resp


class AddStation(Resource):
    @authenticate
    def post(self, **kwargs):
        user = kwargs["user"]
        res = {}
        data = request.get_json()
        if not data:
            return errorMessage("Invalid Request")
        if "category" in data.keys():
            category = data["category"]
        else:
            return errorMessage("Category is required")
        vendor_check = EVBunk.query.filter(EVBunk.user_id == user.id).first()
        if vendor_check is None:
            return errorMessage("User is not a vendor")
        station = Stations(category_id=category, vendor_id=vendor_check.id)
        db.session.add(station)
        db.session.commit()
        res["error"] = ""
        res["status"] = True
        resp = jsonify(res)
        return resp


class ShowMyStations(Resource):
    @authenticate
    def get(self, **kwargs):
        user = kwargs["user"]
        res = {}
        vendor_check = EVBunk.query.filter(EVBunk.user_id == user.id).first()
        if vendor_check is None:
            return errorMessage("User is not a vendor")
        stations = Stations.query.filter(Stations.vendor_id==vendor_check.id).all()
        station_list = []
        for station in stations:
            station_dict = {}
            station_dict["station_id"] = station.id
            station_dict["category"] = station.categoryid.type
            station_dict["is_available"] = station.is_available
            station_list.append(station_dict)
        res["station_list"] = station_list
        res["error"] = ""
        res["status"] = True
        resp = jsonify(res)
        return resp


class ShowVendorBookings(Resource):
    @authenticate
    def get(self, **kwargs):
        user = kwargs["user"]
        res = {}
        vendor_check = EVBunk.query.filter(EVBunk.user_id == user.id).first()
        if vendor_check is None:
            return errorMessage("User is not a vendor")
        stations = Stations.query.filter(Stations.vendor_id == vendor_check.id).all()
        booking_list = []
        for station in stations:
            bookings = Booking.query.filter(and_(Booking.station_id == station.id, or_(Booking.status=="0", Booking.status == "1")) ).all()
            for booking in bookings:
                booking_dict = {}
                booking_dict["booking_id"] = booking.id
                booking_dict["username"] = booking.userid.username
                booking_dict["booking_time"] = booking.booking_time
                payment_id = Payments.query.filter(Payments.booking_id == booking.id).first()
                booking_dict["payment_id"] = payment_id.id
                booking_list.append(booking_dict)
        res["station_list"] = booking_list
        res["error"] = ""
        res["status"] = True
        resp = jsonify(res)
        return resp


class VendorBookingsToday(Resource):
    @authenticate
    def get(self, **kwargs):
        user = kwargs["user"]
        res = {}
        vendor_check = EVBunk.query.filter(EVBunk.user_id == user.id).first()
        if vendor_check is None:
            return errorMessage("User is not a vendor")
        stations = Stations.query.filter(Stations.vendor_id == vendor_check.id).all()
        booking_list = []
        for station in stations:
            bookings = Booking.query.filter(and_(Booking.station_id == station.id, or_(Booking.status=="0"
                , Booking.status == "1"), Booking.booking_time.cast(Date) == datetime.date(datetime.now()))).all()
            for booking in bookings:
                booking_dict = {}
                booking_dict["booking_id"] = booking.id
                booking_dict["username"] = booking.userid.username
                booking_dict["booking_time"] = booking.booking_time
                payment_id = Payments.query.filter(Payments.booking_id == booking.id).first()
                booking_dict["payment_id"] = payment_id.id
                booking_list.append(booking_dict)
        res["station_list"] = booking_list
        res["error"] = ""
        res["status"] = True
        resp = jsonify(res)
        return resp


class VendorBookingsThisWeek(Resource):
    @authenticate
    def get(self, **kwargs):
        user = kwargs["user"]
        res = {}
        vendor_check = EVBunk.query.filter(EVBunk.user_id == user.id).first()
        if vendor_check is None:
            return errorMessage("User is not a vendor")
        stations = Stations.query.filter(Stations.vendor_id == vendor_check.id).all()
        booking_list = []
        for station in stations:
            bookings = Booking.query.filter(and_(Booking.station_id == station.id, or_(Booking.status=="0"
                , Booking.status == "1"), Booking.booking_time.cast(Date) >= datetime.date(datetime.now()) - timedelta(days=7))).all()
            for booking in bookings:
                booking_dict = {}
                booking_dict["booking_id"] = booking.id
                booking_dict["username"] = booking.userid.username
                booking_dict["booking_time"] = booking.booking_time
                payment_id = Payments.query.filter(Payments.booking_id == booking.id).first()
                booking_dict["payment_id"] = payment_id.id
                booking_list.append(booking_dict)
        res["station_list"] = booking_list
        res["error"] = ""
        res["status"] = True
        resp = jsonify(res)
        return resp


class VendorBookingsThisMonth(Resource):
    @authenticate
    def get(self, **kwargs):
        user = kwargs["user"]
        res = {}
        vendor_check = EVBunk.query.filter(EVBunk.user_id == user.id).first()
        if vendor_check is None:
            return errorMessage("User is not a vendor")
        stations = Stations.query.filter(Stations.vendor_id == vendor_check.id).all()
        booking_list = []
        for station in stations:
            bookings = Booking.query.filter(and_(Booking.station_id == station.id, or_(Booking.status=="0"
                , Booking.status == "1"), Booking.booking_time.cast(Date) >= datetime.date(datetime.now()) - timedelta(days=30))).all()
            for booking in bookings:
                booking_dict = {}
                booking_dict["booking_id"] = booking.id
                booking_dict["username"] = booking.userid.username
                booking_dict["booking_time"] = booking.booking_time
                payment_id = Payments.query.filter(Payments.booking_id == booking.id).first()
                booking_dict["payment_id"] = payment_id.id
                booking_list.append(booking_dict)
        res["station_list"] = booking_list
        res["error"] = ""
        res["status"] = True
        resp = jsonify(res)
        return resp


class MyProfits(Resource):
    @authenticate
    def get(self, **kwargs):
        user = kwargs["user"]
        res = {}
        vendor_check = EVBunk.query.filter(EVBunk.user_id == user.id).first()
        if vendor_check is None:
            return errorMessage("User is not a vendor")
        total_sales = 0
        stations = Stations.query.filter(Stations.vendor_id == vendor_check.id).all()
        for station in stations:
            bookings = Booking.query.filter(Booking.station_id == station.id).all()
            for booking in bookings:
                payment = Payments.query.filter(Payments.booking_id == booking.id).first()
                total_sales += payment.amount
        commission = 0.03 * total_sales
        profit = total_sales - commission
        res["total_sales"] = total_sales
        res["commission"] = commission
        res["profit"] = profit
        res["error"] = ""
        res["status"] = True
        resp = jsonify(res)
        return resp


class MyProfitsToday(Resource):
    @authenticate
    def get(self, **kwargs):
        user = kwargs["user"]
        res = {}
        vendor_check = EVBunk.query.filter(EVBunk.user_id == user.id).first()
        if vendor_check is None:
            return errorMessage("User is not a vendor")
        total_sales = 0
        stations = Stations.query.filter(Stations.vendor_id == vendor_check.id).all()
        for station in stations:
            bookings = Booking.query.filter(and_(Booking.station_id == station.id, or_(Booking.status=="0"
                , Booking.status == "1"), Booking.booking_time.cast(Date) == datetime.date(datetime.now()))).all()
            for booking in bookings:
                payment = Payments.query.filter(Payments.booking_id == booking.id).first()
                total_sales += payment.amount
        commission = 0.03 * total_sales
        profit = total_sales - commission
        res["total_sales"] = total_sales
        res["commission"] = commission
        res["profit"] = profit
        res["error"] = ""
        res["status"] = True
        resp = jsonify(res)
        return resp


class MyProfitsThisWeek(Resource):
    @authenticate
    def get(self, **kwargs):
        user = kwargs["user"]
        res = {}
        vendor_check = EVBunk.query.filter(EVBunk.user_id == user.id).first()
        if vendor_check is None:
            return errorMessage("User is not a vendor")
        total_sales = 0
        stations = Stations.query.filter(Stations.vendor_id == vendor_check.id).all()
        for station in stations:
            bookings = Booking.query.filter(and_(Booking.station_id == station.id, or_(Booking.status=="0"
                , Booking.status == "1"), Booking.booking_time.cast(Date) >= datetime.date(datetime.now()) - timedelta(days=7))).all()
            for booking in bookings:
                payment = Payments.query.filter(Payments.booking_id == booking.id).first()
                total_sales += payment.amount
        commission = 0.03 * total_sales
        profit = total_sales - commission
        res["total_sales"] = total_sales
        res["commission"] = commission
        res["profit"] = profit
        res["error"] = ""
        res["status"] = True
        resp = jsonify(res)
        return resp


class MyProfitsThisMonth(Resource):
    @authenticate
    def get(self, **kwargs):
        user = kwargs["user"]
        res = {}
        vendor_check = EVBunk.query.filter(EVBunk.user_id == user.id).first()
        if vendor_check is None:
            return errorMessage("User is not a vendor")
        total_sales = 0
        stations = Stations.query.filter(Stations.vendor_id == vendor_check.id).all()
        for station in stations:
            bookings = Booking.query.filter(and_(Booking.station_id == station.id, or_(Booking.status=="0"
                , Booking.status == "1"), Booking.booking_time.cast(Date) >= datetime.date(datetime.now()) - timedelta(days=30))).all()
            for booking in bookings:
                payment = Payments.query.filter(Payments.booking_id == booking.id).first()
                total_sales += payment.amount
        commission = 0.03 * total_sales
        profit = total_sales - commission
        res["total_sales"] = total_sales
        res["commission"] = commission
        res["profit"] = profit
        res["error"] = ""
        res["status"] = True
        resp = jsonify(res)
        return resp
# Make an api where the user can click on a button in order to make the station available