from flask import Blueprint, jsonify, session, request
from flask_login import login_required, current_user
from app.models import db, User, Direct_Message, Conversation
from app.forms import MessageForm
import logging, traceback, os
# from flask_socketio import SocketIO, emit

# if os.environ.get("FLASK_ENV") == "production":
#     origins = [
#         "http://harmony-aug21.herokuapp.com",
#         "https://harmony-aug21.herokuapp.com"
#     ]
# else:
#     origins = "*"

# socketio = SocketIO(cors_allowed_origins=origins)

conversation_routes = Blueprint('conversations', __name__)


@conversation_routes.route('/<int:user_id>')
@login_required
def conversations(user_id):
    # print(Conversation)
    # convo = User.get_conversations()
    # print('....................')
    # print(convo)
    # print(Conversation.__dict__)
    # user = User.query.get(user_id)
    # print('....................')
    # user = User()
    # from_users = User.query.join(Conversation, User.id == Conversation.from_user).filter(Conversation.from_user == user_id).all()
    # print(from_users)
    print(user_id)
    conversations = db.session.query(Conversation).filter(db.or_(Conversation.from_user == user_id, Conversation.to_user != user_id))
    for conversation in conversations:
        print(conversation.from_user)
        print(conversation.to_user)
    # print(convos[0].id)
    # from_user = user.users
    # print(f'....  {user.__dict__} {type(user)}')
    # conversations = User.query.filter(User.from_user == user_id)
    # print(conversations)
    return {'conversations': [conversation.to_dict() for conversation in conversations]}

@conversation_routes.route('/<int:user_id>', methods=['POST'])
@login_required
def conversations_post(user_id):
    data = request.json
    conversations = db.session.query(Conversation).filter(Conversation.from_user == user_id, Conversation.to_user == data['to_user']).all()
    conversations2 = db.session.query(Conversation).filter(Conversation.from_user == data['to_user'], Conversation.to_user == user_id).all()

    for conversation in conversations2:
        if conversation.id < conversations[0].id:
            conversations.insert(0,conversation)
        else:
            conversations.append(conversation)

    if len(conversations):
        return conversations[0].to_dict()
    else:
        conversation = Conversation(from_user=user_id,
                                    to_user=data['to_user'])
        db.session.add(conversation)
        db.session.commit()
        return conversation.to_dict()

@conversation_routes.route('/<int:conversation_id>', methods=['PUT'])
@login_required
def edit_conversation(id):
    pass
    # conversation = Conversation.query.get(id)
    # conversation.conversation_name = form.data['conversation_name'],
    # db.session.commit()

    # return conversation.to_dict()


@conversation_routes.route('/<int:conversation_id>', methods=['DELETE'])
@login_required
def delete_conversation(id):
    # conversation = Conversation.query.get(id)
    # db.session.delete(conversation)
    db.session.commit()
    # return jsonify(f"successfully deleted conversation {conversation.conversation_name}")



@conversation_routes.route('/<int:conversation_id>/messages')
@login_required
def messages(conversation_id):
    conversation = db.session.query(Conversation).get_or_404(conversation_id)
    messages = Direct_Message.query.filter(Direct_Message.conversation_id == conversation_id)
    return {'messages': [message.to_dict() for message in messages if message.user_id == conversation.from_user or message.user_id == conversation.to_user]}

# @socketio.event
# def message(data):
#     print(data)
#     emit("message", data, broadcast=True)

# @socketio.event
# def message_edit(data):
#     emit("message_edit", data, broadcast=True)

# @socketio.event
# def message_delete(data):
#     emit("message_delete", data, broadcast=True)

@conversation_routes.route('/<int:conversation_id>/messages', methods=['POST'])
@login_required
def add_message(conversation_id):
    form = MessageForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    try:
        if form.validate_on_submit():
            new_message = Direct_Message(
                content=form.data['content'],
                user_id=current_user.id,
                conversation_id=conversation_id,
            )
            db.session.add(new_message)
            db.session.commit()
            return new_message.to_dict()
    except Exception as e:
        logging.error(traceback.format_exc())
        return e
