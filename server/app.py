from flask import Flask
from flask_restful import Api
from resources.controller import *
from models.models import *

# Initializing the flask app
app = Flask(__name__)
api = Api(app)
app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://postgres:''@localhost/dbs_proj"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

@app.route("/create_tables")
@app.before_first_request
def create_tables():
    db.create_all()
    return {"message": "Success"}

@app.route("/users")
def Test():
    test = Session(authtoken="Test1")
    db.session.add(test)
    db.session.commit()
    return {"message": f"Authtoken: {test.authtoken}, is_active: {test.is_active}"}

api.add_resource(Register, '/v1/api/Register')
api.add_resource(Login, '/v1/api/Login')
api.add_resource(Logout, '/v1/api/Logout')

api.add_resource(BookAStation, '/v1/api/Book/<id>')
api.add_resource(ShowMyBookings, '/v1/api/myBookings')

if __name__ == "__main__":
    from db import db
    db.init_app(app)
    app.run(port=5000)