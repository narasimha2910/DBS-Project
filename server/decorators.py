from models.models import Session
from flask import request, Response
from functools import wraps
from sqlalchemy import and_


def authenticate(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        try:
            authtoken = request.headers['authtoken']
        except:
            return Response('Authentication Error! Auth Token is missing', 401, {'WWW-Authenticate': 'API token error'})
        auth = Session.query.filter(and_(Session.authtoken == authtoken, Session.is_active == True)).first()
        if not auth:
            return Response('Authentication Error! Token is invalid or does not belong to the user', 401,
                            {'WWW-Authenticate': 'API token error'})
        kwargs['session'] = auth
        kwargs['user'] = auth.userid
        return f(*args, **kwargs)

    return wrapper