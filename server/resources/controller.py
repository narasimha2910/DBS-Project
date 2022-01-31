from datetime import datetime, timedelta
from os import stat
from sqlalchemy import and_, Date, or_
from models.models import *
from flask import jsonify, request
from flask_restful import Resource
import bcrypt, random, string
from decorators import authenticate
from db import db
from otp import send_otp, verify_otp


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

    
class AddVehicle(Resource):
    @authenticate
    def post(seldf, **kwargs):
        user = kwargs["user"]
        res = {}
        data = request.get_json()
        if "number_plate" not in data.keys():
            return errorMessage("Number plate is required")
        else:
            number_plate = data["number_plate"]
        if "category_id" not in data.keys():
            return errorMessage("Category is required")
        else:
            category_id = data["category_id"]
        vehicle = VehicleInfo(number_plate=number_plate, category_id=category_id, user_id=user.id)
        db.session.add(vehicle)
        db.session.commit()
        res["status"] = True
        res["error"] = ""
        res["vehicle_id"] = vehicle.number_plate
        resp = jsonify(res)
        return resp


class BookAStation(Resource):
    @authenticate
    def get(self, id, vendor_id , **kwargs):
        user = kwargs["user"]
        # user = User.query.filter(id =10)
        print(user)
        res = {}
        booking_check = Booking.query.filter(and_(Booking.user_id == user.id, Booking.status == "0")).first()
        if(booking_check):
            return errorMessage("You have already booked a station. Complete that to book again")
        station_check = Stations.query.filter(Stations.category_id == id, Stations.is_available == True, Stations.vendor_id == vendor_id).first()
        if station_check is None:
            return errorMessage("No station exists")
        categoryCheck = VehicleInfo.query.filter(and_(VehicleInfo.user_id == user.id, VehicleInfo.category_id == id)).first()
        if categoryCheck is None:
            return errorMessage("User does not have vehicle in this category")
        booking = Booking(user_id = user.id, station_id = station_check.id, status="0") #Ongoing
        # Set is_available = false
        # Book based on category and check if the user has a vehicle in this category
        db.session.add(booking)
        station_check.is_available = False
        db.session.commit()
        send_otp(user.phone, user.id, booking.id)
        res["booking_id"] = booking.id
        res["station_id"] = booking.station_id
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
            book_dict["b_id"] = booking.id
            book_dict["time"] = booking.booking_time
            book_dict["stime"] = booking.start_time
            bunk_name = booking.stationid.vendorid.name
            book_dict["ev_bunk"] = bunk_name
            if booking.status == "0":
                book_dict["status"] = "Ongoing"
            elif booking.status == "1":
                book_dict["status"] = "Completed"
            else:
                book_dict["status"] = "Discarded"
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
        booking_check = Booking.query.filter(and_(Booking.id==b_id, Booking.status == "0")).first()
        if not booking_check:
            return errorMessage("No such booking exist/ Already paid")
        print(booking_check.start_time)
        time_delta = datetime.now() - booking_check.start_time
        time_delta = time_delta.total_seconds()
        print(time_delta)
        minutes = time_delta // 60
        print(minutes)
        amount = round(booking_check.stationid.vendorid.cost_per_kwh * (minutes))
        print(amount)
        # check if the same user who booked is paying
        # also check if user has already payed for the booking_id
        # Make station is_available = True
        state = "success"
        if state == "success":
            payment = Payments(booking_id=b_id, amount=amount, payment_status=state, status_code=0, payment_mode="Online")
            db.session.add(payment)
            db.session.commit()
            booking_check.status = "1"
            booking_check.stationid.is_available = True
            db.session.commit()
            res["error"] = ""
            res["status"] = True
            res["amount"] = amount
            res["status"] = state
            res["payment_id"] = payment.id
            res["username"] = user.username
            resp = jsonify(res)
            return resp
        else:
            payment = Payments(booking_id=b_id, amount=amount, payment_status=state, status_code=1, payment_mode="Failure")
            db.session.add(payment)
            db.session.commit()
            booking_check.status = "2"
            booking_check.stationid.is_available = True
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


class VerifyBooking(Resource):
    @authenticate
    def post(self, **kwargs):
        user = kwargs["user"]
        res = {}
        data = request.get_json()
        if not data:
            return errorMessage("Invalid Request")
        if "otp" not in data.keys():
            return errorMessage("OTP is required")
        else:
            otp = int(data["otp"])
        if "booking_id" not in data.keys():
            return errorMessage("Booking ID is required")
        else:
            booking = data["booking_id"]
        vendor_check = EVBunk.query.filter(EVBunk.user_id == user.id).first()
        if vendor_check is None:
            return errorMessage("User is not a vendor")

        bookingCheck = Booking.query.filter(and_(Booking.id == booking, or_(Booking.status!="2", Booking.status=="1"))).first()
        if not bookingCheck:
            return errorMessage("Booking does not exist")
        
        status, wrong_count = verify_otp(otp, bookingCheck.userid.id, bookingCheck.id)
        if status == "Failure" and wrong_count <= 3:
            return errorMessage("Wrong OTP")
        
        if status == "Failure" and wrong_count > 3:
            bookingCheck.status = "2"
            bookingCheck.stationid.is_available = True
            db.session.commit()
            return errorMessage("OTP limit exceeded, Booking discarded")
        
        if status == "Success" and wrong_count == "success":
            bookingCheck.start_time = datetime.now()
            db.session.commit()
            res["status"] = True
            res["error"] = ""
            res["message"] = "Verification Successful"
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
                if payment_id is None:
                    booking_dict["payment_id"] = "Pending"
                else:    
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
                if payment_id is None:
                    booking_dict["payment_id"] = "Pending"
                else:    
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


        d = datetime.date(datetime.now()).isocalendar()[1]
        y = datetime.date(datetime.now()).year
        r = str(y)+"-W"+str(d)
        result = datetime.strptime(r + '-1', "%Y-W%W-%w")
        print(result)
        stations = Stations.query.filter(Stations.vendor_id == vendor_check.id).all()
        booking_list = []
        for station in stations:
            bookings = Booking.query.filter(and_(Booking.station_id == station.id, or_(Booking.status=="0"
                , Booking.status == "1"), Booking.booking_time.cast(Date) >= result)).all()
            for booking in bookings:
                booking_dict = {}
                booking_dict["booking_id"] = booking.id
                booking_dict["username"] = booking.userid.username
                booking_dict["booking_time"] = booking.booking_time
                payment_id = Payments.query.filter(Payments.booking_id == booking.id).first()
                if payment_id is None:
                    booking_dict["payment_id"] = "Pending"
                else:    
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
                , Booking.status == "1"), Booking.booking_time.cast(Date) >= datetime.today().replace(day=1))).all()
            for booking in bookings:
                booking_dict = {}
                booking_dict["booking_id"] = booking.id
                booking_dict["username"] = booking.userid.username
                booking_dict["booking_time"] = booking.booking_time
                payment_id = Payments.query.filter(Payments.booking_id == booking.id).first()
                if payment_id is None:
                    booking_dict["payment_id"] = "Pending"
                else:    
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
        d = datetime.date(datetime.now()).isocalendar()[1]
        y = datetime.date(datetime.now()).year
        r = str(y)+"-W"+str(d)
        result = datetime.strptime(r + '-1', "%Y-W%W-%w")
        print(result)
        stations = Stations.query.filter(Stations.vendor_id == vendor_check.id).all()
        for station in stations:
            bookings = Booking.query.filter(and_(Booking.station_id == station.id, or_(Booking.status=="0"
                , Booking.status == "1"), Booking.booking_time.cast(Date) >= result)).all()
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
        print(datetime.today().replace(day=1))
        stations = Stations.query.filter(Stations.vendor_id == vendor_check.id).all()
        for station in stations:
            bookings = Booking.query.filter(and_(Booking.station_id == station.id, or_(Booking.status=="0"
                , Booking.status == "1"), Booking.booking_time.cast(Date) >= datetime.today().replace(day=1))).all()
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

class ShowAvailableStations(Resource):
    @authenticate
    def get(self, **kwargs):
        user = kwargs["user"]
        res = {}
        vendor_list = []
        vendors = EVBunk.query.filter().all()
        if vendors:
            for vendor in vendors:
                vendor_dict = {}
                vendor_dict["vendor_id"] = vendor.id
                vendor_dict["vendor_name"] = vendor.name
                vendor_dict["latitude"] = vendor.latitude
                vendor_dict["longitude"] = vendor.longitude
                # vendor_dict["rating"] = vendor.rating
                stations_4 = Stations.query.filter(and_(Stations.vendor_id==vendor.id, Stations.is_available==True, Stations.category_id==1)).all()
                vendor_dict["f_wheeler"] = len(stations_4)
                stations_2 = Stations.query.filter(and_(Stations.vendor_id==vendor.id, Stations.is_available==True, Stations.category_id==2)).all()
                vendor_dict["t_wheeler"] = len(stations_2)
                vendor_list.append(vendor_dict)
        res["vendors_list"] = vendor_list
        res["error"] = ""
        res["status"] = True
        resp = jsonify(res)
        return resp

class OngoingBooking(Resource):
    @authenticate
    def get(self, **kwargs):
        user = kwargs["user"]
        res = {}
        booking = Booking.query.filter(and_(Booking.user_id == user.id, Booking.status == "0")).first()
        if not booking:
            return errorMessage("No ongoing bookings")
        res["booking_id"] = booking.id
        res["start_time"] = booking.start_time
        res["booking_time"] = booking.booking_time
        res["station_id"] = booking.station_id
        res["error"] = ""
        res["status"] = True
        resp = jsonify(res)
        return resp

class PaymentHistory(Resource):
    @authenticate
    def get(self, **kwargs):
        user = kwargs["user"]
        res = {}
        payments_list = []
        bookings = Booking.query.filter(Booking.user_id == user.id)
        if not bookings:
            return errorMessage("No payments to show")
        for booking in bookings:
            payment = Payments.query.filter(and_(Payments.booking_id == booking.id)).first()
            payment_dic = {}
            payment_dic["payment_id"] = payment.id
            payment_dic["payment_status"] = payment.payment_status
            payment_dic["vendor_name"] = payment.bookingid.stationid.vendorid.name
            payment_dic["payment_time"] = payment.payment_time
            payments_list.append(payment_dic)
        res["payments_list"] = payments_list
        res["error"] = ""
        res["status"] = True
        resp = jsonify(res)
        return resp

class VehicleData(Resource):
    @authenticate
    def get(self, **kwargs):
        user = kwargs["user"]
        res = {}
        vehicle_list = []
        vehicles = VehicleInfo.query.filter(VehicleInfo.user_id == user.id).all()
        for vehicle in vehicles:
            vehicle_dic = {}
            vehicle_dic["plate"] = vehicle.number_plate
            if(vehicle.category_id == 1):
                vehicle_dic["cat"] = "Four Wheeler"
            else:
                vehicle_dic["cat"] = "Two Wheeler"
            vehicle_list.append(vehicle_dic)
        res["vehicle_list"] = vehicle_list
        res["error"] = ""
        res["status"] = True
        resp = jsonify(res)
        return resp


# Make an api where the user can click on a button in order to make the station available