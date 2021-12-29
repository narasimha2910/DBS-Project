from sqlalchemy import and_
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
        booking = Booking(user_id = user.id, station_id = id, status="2")
        # otp = random.choice(string.digits, k=4)
        db.session.add(booking)
        db.session.commit()
        res["booking_id"] = booking.id
        res["username"] = user.username
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
        resp = jsonify(res)
        return resp