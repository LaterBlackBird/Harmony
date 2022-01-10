from flask import Blueprint, jsonify
from flask_login import login_required
from app.models import Channel

channel_routes = Blueprint('channels', __name__)


@channel_routes.route('/')
@login_required
def channels():
    channels = Channel.query.all()
    print(channels)
    return {'channels': [channel.to_dict() for channel in channels]}


# @user_routes.route('/<int:id>')
# @login_required
# def user(id):
#     user = User.query.get(id)
#     return user.to_dict()
