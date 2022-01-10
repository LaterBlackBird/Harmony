from flask import Blueprint, jsonify
from flask_login import login_required
from app.models import db, Message

message_routes = Blueprint('messages', __name__)

@message_routes.route('/<int:id>', methods=['PATCH'])
def messages_patch():
    pass

@message_routes.route('/<int:id>', methods=['DELETE'])
def messages_delete():
    pass