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


# Defining endpoints
api.add_resource(Hello, '/v1/api/Hello')
api.add_resource(Send, '/v1/api/Send')


if __name__ == "__main__":
    from db import db
    db.init_app(app)
    app.run(debug=True, port=5000)