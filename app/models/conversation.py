from .db import db

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

    direct_messages = db.relationship('Direct_Message', back_populates='conversation')

db.mapper(Conversation, conversations)