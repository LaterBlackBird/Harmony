from flask import Blueprint, request
from flask_login import login_required
from app.models import db, Message
from app.forms import MessageForm

message_routes = Blueprint('messages', __name__)

@message_routes.route('/<int:id>')
@login_required
def message(id):
    message = Message.query.get(id)
    return {'content': message.to_dict()}

@message_routes.route('/<int:id>', methods=['PATCH'])
@login_required
def message_patch(id):
    form = MessageForm()

    old_message = Message.query.get_or_404(id)
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        old_message.content = form.data['content']
        db.session.add(old_message)
        db.session.commit()
        return old_message.to_dict()

@message_routes.route('/<int:id>', methods=['DELETE'])
def messages_delete(id):
    message = Message.query.get(id)
    db.session.delete(message)
    db.session.commit()
    return { "message": "success" }
