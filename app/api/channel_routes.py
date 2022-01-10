from flask import Blueprint, jsonify, session, request
from flask_login import login_required
from app.models import db, Channel
from app.forms import ChannelForm

channel_routes = Blueprint('channels', __name__)

# Used for testing route and returning data
# @channel_routes.route('/')
# @login_required
# def channels():
#     channels = Channel.query.all()
#     print(channels)
#     return {'channels': [channel.to_dict() for channel in channels]}



@channel_routes.route('/<int:id>', methods=['PUT'])
@login_required
def edit_channel(id):
    channel = Channel.query.get(id)
    form = ChannelForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        channel.channel_name = form.data['channel_name'],
        db.session.commit()

    return channel.to_dict()


@channel_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_channel(id):
    channel = Channel.query.get(id)
    db.session.delete(channel)
    db.session.commit()
    return jsonify(f"successfully deleted channel {channel.channel_name}")
