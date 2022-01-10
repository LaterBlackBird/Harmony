from .db import db
from .direct_message import Direct_Message

conversations = db.Table(
    'conversations', db.metadata,
    db.Column('id', db.Integer, primary_key=True),
    db.Column('to_user', db.Integer, db.ForeignKey('users.id')),
    db.Column('from_user', db.Integer, db.ForeignKey('users.id'))
)

class Conversation(object):
    def __init__(self, to_user, from_user):
        self.to_user = to_user
        self.from_user = from_user

db.mapper(Conversation, conversations, properties={
    'direct_messages' : db.relationship(Direct_Message, backref='conversation')
})

