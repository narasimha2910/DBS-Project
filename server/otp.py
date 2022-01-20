import random
from twilio.rest import Client
from db import db
from sqlalchemy import and_
from models.models import OTP

def send_otp(phone_number, user_id, booking_id):
    mobile = "+91"+str(phone_number)
    otp = random.randint(1000,9999)

    account_sid = "AC4d4c77bed62a59524fe32b47c1a54878"
    authtoken = "f6e5687295e271de447a02e6dca68ad1"

    client = Client(account_sid,authtoken)

    otp_obj = OTP(otp=otp, user_id=user_id, booking_id=booking_id)
    db.session.add(otp_obj)
    db.session.commit()

    msg = client.messages.create(
        body = f"Your NaEVgation OTP is {otp}",
        from_="+19378874333",
        to=mobile
    )

def verify_otp(otp, user_id, booking_id):
    otp_check = OTP.query.filter(and_(OTP.otp == otp, OTP.user_id == user_id, OTP.booking_id == booking_id, OTP.is_used == 0)).first()
    if otp_check:
        otp_check.is_used = 1
        db.session.commit()
        return "Success", "success"
    else:
        otp_check = OTP.query.filter(and_(OTP.user_id == user_id, OTP.booking_id == booking_id)).first()
        otp_check.wrong_count += 1
        db.session.commit()
        if otp_check.wrong_count > 3:
            otp_check.is_used = 1
            db.session.commit()
        return "Failure", otp_check.wrong_count
