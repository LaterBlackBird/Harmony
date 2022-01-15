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
    conversations = db.session.query(Conversation).filter(db.or_(Conversation.from_user == user_id, Conversation.to_user == user_id))

    conversations_from = db.session.query(Conversation.from_user).filter(Conversation.to_user == user_id).subquery()
    conversations_to = db.session.query(Conversation.to_user).filter(Conversation.from_user == user_id).subquery()
    users = db.session.query(User).filter(db.or_(User.id.in_(conversations_to), User.id.in_(conversations_from)))
    # conversations = db.session.query(Conversation).filter(db.or_(Conversation.from_user == user_id, Conversation.to_user == user_id)).all()
    # print(convos[0].id)
    # from_user = user.users
    # print(f'....  {user.__dict__} {type(user)}')
    # conversations = User.query.filter(User.from_user == user_id)
    # print(conversations)

    return {'conversations': {
            'conversations': [conversation.to_dict() for conversation in conversations],
            'other_user': [user.to_dict() for user in users]
        }
    }

@conversation_routes.route('/<int:user_id>', methods=['POST'])
@login_required
def conversations_post(user_id):
    data = request.json
    conversations = db.session.query(Conversation).filter(Conversation.from_user == user_id, Conversation.to_user == data['to_user']).all()
    conversations2 = db.session.query(Conversation).filter(Conversation.from_user == data['to_user'], Conversation.to_user == user_id).all()

    if len(conversations2):
        for conversation in conversations2:
            if len(conversations) and conversation.id < conversations[0].id:
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

# @conversation_routes.route('/<int:conversation_id>', methods=['PUT'])
# @login_required
# def edit_conversation(id):
#     pass
#     # conversation = Conversation.query.get(id)
#     # conversation.conversation_name = form.data['conversation_name'],
#     # db.session.commit()

#     # return conversation.to_dict()


@conversation_routes.route('/<int:conversation_id>', methods=['DELETE'])
@login_required
def delete_conversation(conversation_id):
    data = request.json
    conversation = db.session.query(Conversation).get_or_404(conversation_id)
    print(data)
    print(conversation.id)
    print(conversation.from_user == None)
    print(conversation.to_user == None)
    if conversation.from_user == int(data['userId']):
        print('in from')
        if conversation.to_user == None:
            db.session.delete(conversation)
            db.session.commit()
        else:
            conversation.from_user = None
            db.session.add(conversation)
            db.session.commit()
        return { "conversation": "success" }
    if conversation.to_user == int(data['userId']):
        print('in to')
        if conversation.from_user == None:
            print('in to again')
            db.session.delete(conversation)
            db.session.commit()
        else:
            conversation.to_user = None
            db.session.add(conversation)
            db.session.commit()
        return { "conversation": "success" }


@conversation_routes.route('/<int:conversation_id>/messages/<int:user_id>')
@login_required
def messages(conversation_id, user_id):
    conversation = db.session.query(Conversation).get_or_404(conversation_id)
    messages = Direct_Message.query.filter(Direct_Message.conversation_id == conversation_id).all()
    messages_and_users = []
    print(user_id == conversation.from_user or user_id == conversation.to_user)
    if user_id == conversation.from_user:
        if messages:
            for message in messages:
                user = User.query.get_or_404(message.user_id)
                messages_and_users.append([message.to_dict(), user.username, user.profile_image])
            return {'messages': messages_and_users}
        return { 'messages': [[{'id': 0}]]}
    elif user_id == conversation.to_user:
        if messages:
            for message in messages:
                user = User.query.get_or_404(message.user_id)
                messages_and_users.append([message.to_dict(), user.username, user.profile_image])
            return {'messages': messages_and_users}
        return { 'messages': [[{'id': 0}]]}

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
