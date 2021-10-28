from flask import Flask
from flask_restful import Api
from db import db
from resources.controller import *

# Initializing the flask app
app = Flask(__name__)
api = Api(app)


# Defining endpoints
api.add_resource(Hello, '/v1/api/Hello')
api.add_resource(Send, '/v1/api/Send')

if __name__ == "__main__":
    app.run(debug=True, port=5000)