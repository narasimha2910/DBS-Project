from db import db
from datetime import datetime

class User(db.Model):
    __tablename__ = "user"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(10), nullable=False)
    username = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    password = db.Column(db.String(100), nullable=False)
    profile_pic = db.Column(db.String(100), nullable=False)
    created_time = db.Column(db.DateTime, default=datetime.now())

class Session(db.Model):
    __tablename__ = "session"

    authtoken = db.Column(db.String(32), primary_key=True)
    is_active = db.Column(db.Boolean, default=1)
    user_id = db.Column(db.Integer)
    userid = db.relationship("User", foreign_keys=user_id, primaryjoin="Session.user_id==User.id")
    created_time = db.Column(db.DateTime, default=datetime.now())