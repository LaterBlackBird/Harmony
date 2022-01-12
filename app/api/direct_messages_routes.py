from flask import Blueprint, request
from flask_login import login_required
from app.models import db, Direct_Message, Conversation
from app.forms import MessageForm

direct_message_routes = Blueprint('direct_messages', __name__)

# @direct_message_routes.route('/<int:id>')
# @login_required
# def message(id):
#     # message = Direct_Message.query.get(id)
#     # return {'content': message.to_dict()}
#     print('.................top...................')

@direct_message_routes.route('/<int:id>', methods=['PATCH'])
@login_required
def message_patch(id):
    form = MessageForm()
    old_message = Direct_Message.query.get_or_404(id)
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        old_message.content = form.data['content']
        db.session.add(old_message)
        db.session.commit()
        return old_message.to_dict()

@direct_message_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def messages_delete(id):
    message = Direct_Message.query.get_or_404(id)
    db.session.delete(message)
    db.session.commit()
    return { "message": "success" }
