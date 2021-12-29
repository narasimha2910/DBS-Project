from db import db
from datetime import datetime

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(10), nullable=False)
    username = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    password = db.Column(db.String(100), nullable=False)
    profile_pic = db.Column(db.String(100), nullable=False)
    created_time = db.Column(db.DateTime, default=datetime.now())


class EVBunk(db.Model):
    __tablename__ = "ev_bunk"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    cost_per_kwh = db.Column(db.Float, default=0.0)
    latitude = db.Column(db.String(255))
    longitude = db.Column(db.String(255))
    user_id = db.Column(db.Integer)
    userid = db.relationship("User", foreign_keys=user_id, primaryjoin="EVBunk.user_id==User.id")


class Category(db.Model):
    __tablename__ = "category"

    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(20), nullable=False)



class Session(db.Model):
    __tablename__ = "session"

    authtoken = db.Column(db.String(32), primary_key=True)
    is_active = db.Column(db.Boolean, default=1)
    user_id = db.Column(db.Integer) #10
    userid = db.relationship("User", foreign_keys=user_id, primaryjoin="Session.user_id==User.id")
    created_time = db.Column(db.DateTime, default=datetime.now())



class VehicleInfo(db.Model):
    __tablename__ = "vehicle_info"

    number_plate = db.Column(db.String(15), primary_key=True)
    category_id = db.Column(db.Integer, primary_key=True)
    categoryid = db.relationship("Category", foreign_keys=category_id, primaryjoin="VehicleInfo.category_id==Category.id")
    user_id = db.Column(db.Integer)
    userid = db.relationship("User", foreign_keys=user_id, primaryjoin="VehicleInfo.user_id==User.id")


class Stations(db.Model):
    __tablename__ = "stations"

    id = db.Column(db.Integer, primary_key=True)
    category_id = db.Column(db.Integer, primary_key=True)
    categoryid = db.relationship("Category", foreign_keys=category_id, primaryjoin="Stations.category_id==Category.id")
    vendor_id = db.Column(db.Integer)
    vendorid = db.relationship("EVBunk", foreign_keys=vendor_id, primaryjoin="Stations.vendor_id==EVBunk.id")

class DriversLicense(db.Model):
    __tablename__ = "drivers_license"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer)
    userid = db.relationship("User", foreign_keys=user_id, primaryjoin="DriversLicense.user_id==User.id")
    license_number = db.Column(db.String(20), nullable=False)
    front_img = db.Column(db.String(255), nullable=False)
    back_img = db.Column(db.String(255), nullable=False)
    is_verified =  db.Column(db.Boolean, default=False)


class Booking(db.Model):
    __tablename__ = "booking"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer)
    userid = db.relationship("User", foreign_keys=user_id, primaryjoin="Booking.user_id==User.id")
    station_id = db.Column(db.Integer)
    stationid = db.relationship("Stations", foreign_keys=station_id, primaryjoin="Booking.station_id==Stations.id")
    booking_time = db.Column(db.DateTime, default=datetime.now())
    status = db.Column(db.String(30))
    # 0-> Ongoing, 1 -> Done , 2 -> Payment failed


class Payments(db.Model):
    __tablename__ = "payments"

    id = db.Column(db.Integer, primary_key=True)
    payment_status = db.Column(db.String(30))
    status_code = db.Column(db.Integer)
    amount = db.Column(db.Float)
    payment_mode = db.Column(db.String(20))
    payment_time = db.Column(db.DateTime, default=datetime.now())
    # 0 -> Success, 1-> Failed, 2 -> Pending


class Reviews(db.Model):
    __tablename__ = "reviews"

    user_id = db.Column(db.Integer, primary_key=True)
    userid = db.relationship("User", foreign_keys=user_id, primaryjoin="Reviews.user_id==User.id")
    vendor_id = db.Column(db.Integer, primary_key=True)
    vendorid = db.relationship("EVBunk", foreign_keys=vendor_id, primaryjoin="Reviews.vendor_id==EVBunk.id")
    rating = db.Column(db.Integer)
    review = db.Column(db.String(50))
