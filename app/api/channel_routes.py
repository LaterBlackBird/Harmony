from flask import Blueprint, jsonify, session, request
from flask_login import login_required, current_user
from app.models import db, Channel, Message, User
from app.forms import ChannelForm, channel_form
from app.forms import MessageForm
import logging, traceback, os
from flask_socketio import SocketIO, emit

if os.environ.get("FLASK_ENV") == "production":
    origins = [
        "http://harmony-aug21.herokuapp.com",
        "https://harmony-aug21.herokuapp.com"
    ]
else:
    origins = "*"

socketio = SocketIO(cors_allowed_origins=origins)

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



@channel_routes.route('/<int:id>/messages')
@login_required
def messages(id):
    messages = Message.query.filter(Message.channel_id == id)
    messages_and_users = []
    for message in messages:
        user = User.query.get_or_404(message.user_id)
        messages_and_users.append([message.to_dict(), user.username, user.profile_image])
    return {'messages': messages_and_users}

@socketio.event
def message(data):
    print(data)
    emit("message", data, broadcast=True)

@socketio.event
def message_edit(data):
    emit("message_edit", data, broadcast=True)

@socketio.event
def message_delete(data):
    emit("message_delete", data, broadcast=True)

@channel_routes.route('/<int:channel_id>/messages', methods=['POST'])
@login_required
def add_message(channel_id):
    form = MessageForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    try:
        if form.validate_on_submit():
            new_message = Message(
                content=form.data['content'],
                user_id=current_user.id,
                channel_id=channel_id,
            )
            db.session.add(new_message)
            db.session.commit()
            return new_message.to_dict()
    except Exception as e:
        logging.error(traceback.format_exc())
        return e
