from flask import Blueprint, jsonify, session, request
from app.models import Server, db, User
from app.forms import CreateServerForm, UpdateServerForm
from app.models import Server, db, Channel
from app.forms import CreateServerForm, UpdateServerForm
from app.forms import ChannelForm
from flask_login import login_required


server_routes = Blueprint('servers', __name__)


@server_routes.route('/')
def servers():
  servers = Server.query.all()
  return {'servers': [server.to_dict() for server in servers]}

@server_routes.route('/<int:id>')
def server_by_id(id):
  server = Server.query.get_or_404(id)
  users = server.users
  for user in users:
    print(user.to_dict())

  return {'server':[server.to_dict()]}


@server_routes.route('/', methods=['POST'])
def create_server():
  form = CreateServerForm()

  server_name = form.data['server_name']
  server_image = form.data['server_image']

  new_server = Server(server_name=server_name, server_image=server_image)

  try:
    db.session.add(new_server)
    db.session.commit()
    return new_server.to_dict()
  except:
    return "There was an error creating that server"


@server_routes.route('/<int:id>', methods=['PUT'])
def update_server(id):
  server = Server.query.get_or_404(id)

  form = UpdateServerForm()

  server.server_name = form.data['server_name']
  server.server_image = form.data['server_image']

  db.session.commit()


@server_routes.route('/<int:id>', methods=['DELETE'])
def delete_server(id):
  server = Server.query.get_or_404(id)
  try:
    db.session.delete(server)

    db.session.commit()

    return "Successfully deleted the server!"
  except:
    return "There was an error deleting the server!"

# Get all channels associated with the current server
@server_routes.route('/<int:serverId>/channels')
@login_required
def get_channels(serverId):
    channels = Channel.query.filter(Channel.server_id == serverId)
    return {'channels': [channel.to_dict() for channel in channels]}


# Create a new channel
@server_routes.route('/<int:serverId>/channels', methods=['POST'])
@login_required
def add_channel(serverId):
    form = ChannelForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        new_channel = Channel(
            channel_name=form.data['channel_name'],
            server_id=serverId,
        )
        db.session.add(new_channel)
        db.session.commit()
    return new_channel.to_dict()


@server_routes.route('/<int:serverId>/join', methods=['POST'])
@login_required
def join_server(serverId):

  userId = request.json['userId']

  user_object = User.query.filter(User.id == userId).first()

  server_object = Server.query.get_or_404(serverId)

  server_object.add_user(user_object)

  return server_object.to_dict()
