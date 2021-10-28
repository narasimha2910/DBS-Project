from flask_restful import Resource, reqparse
from flask import jsonify


# Resource Classes
class Hello(Resource):
    def get(self):
        result = {}
        result["message"] = "Hello API test"
        response = jsonify(result)
        return response

class Send(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument("name", type=str, required=True )
    def post(self):
        data = self.parser.parse_args()
        result = {}
        result["name"] = "Hello " + data["name"]
        response = jsonify(result)
        return response
