from flask import Blueprint, jsonify, session, request
from flask_login import login_required
from app.models import db, Channel
# from app.forms import CreateChannel

channel_routes = Blueprint('channels', __name__)

# Used for testing route and returning data
# @channel_routes.route('/')
# @login_required
# def channels():
#     channels = Channel.query.all()
#     print(channels)
#     return {'channels': [channel.to_dict() for channel in channels]}


# move this to the server routes
@channel_routes.route('/<int:serverId>/channels')
@login_required
def get_channels(serverId):
    channels = Channel.query.filter(Channel.server_id == serverId)
    return {'channels': [channel.to_dict() for channel in channels]}


# move this to the server routes
@channel_routes.route('/<int:serverId>/channel', methods=['POST'])
@login_required
def add_channel(serverId):
    form = CreateChannel()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        new_channel = Channel(
            channel_name=form.data['channel_name'],
            server_id=serverId,
        )
        db.session.add(new_channel)
        db.session.commit()
    return jsonify("channel created")


# @channel_routes.route('/<int:id>', methods=['PUT'])
# @login_required
# def edit_channel(id):
#     channel = Channel.query.get(id)
#     return jsonify(channel.channel_name)


@channel_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_channel(id):
    channel = Channel.query.get(id)
    db.session.delete(channel)
    db.session.commit()
    return jsonify(f"successfully deleted channel {channel.channel_name}")


# @user_routes.route('/<int:id>')
# @login_required
# def user(id):
#     user = User.query.get(id)
#     return user.to_dict()
