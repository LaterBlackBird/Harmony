from flask import Blueprint, jsonify, session, request
from app.models import Server, db, User, Server_Members
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
  data = request.json

  server_name = form.data['server_name']
  server_image = form.data['server_image']

  new_server = Server(server_name=server_name, server_image=server_image)
  try:
    db.session.add(new_server)
    db.session.commit()
  except:
    return "There was an error creating that server"
    
  new_admin = Server_Members(server_id=new_server.id,
                            user_id=data['currentUser'],
                            admin=True)
  print(new_admin)
  try:
    db.session.add(new_admin)
    db.session.commit()
    return new_server.to_dict()
  except:
    return "There was an error creating admin"


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

@server_routes.route('/<int:server_id>/add_admin', methods=['PATCH'])
def add_admin(server_id):
  user = request.json
  user_id = user['userId']

  member = db.session.query(Server_Members).filter(Server_Members.server_id == server_id, Server_Members.user_id == user_id).first()
  member.admin = True
  db.session.commit()
  return member.to_dict()

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

# @server_routes.route('/<int:server_id>/joinAsAdmin', methods=['PATCH'])
# @login_required
# def join_server_as_admin(server_id):
#   user = request.json
#   user_id = user['userId']

#   member = db.session.query(Server_Members).filter(Server_Members.server_id == server_id, Server_Members.user_id == user_id).first()
#   member.admin = True
#   db.session.commit()
#   return member.to_dict()
