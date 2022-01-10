from flask import Blueprint, jsonify
from app.models import Server

server_routes = Blueprint('servers', __name__)


@server_routes.route('/')
def servers():
  servers = Server.query.all()
  return {'servers': [server.to_dict() for server in servers]}
