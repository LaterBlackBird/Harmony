from flask import Blueprint, jsonify
from flask_login import login_required
from app.models import Message

message_routes = Blueprint('messages', __name__)

# to channel routes
@message_routes('/<int:id>/messages')
def messages(id):
    messages = Channel.query.get_or_404(id)
# to channel routes
@message_routes('/<int:id>/messages', methods=['POST'])
def messages_post():
    pass

@message_routes('/<int:id>', methods=['PATCH'])
def messages_patch():
    pass

@message_routes('/<int:id>', methods=['DELETE'])
def messages_delete():
    pass