from .db import db

class Direct_Message(db.Model):
    __tablename__ = 'direct_messages'

    id = db.Column(db.Integer, primary_key=True, nullable=False)
    content = db.Column(db.String(2000), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    conversation_id = db.Column(db.Integer, db.ForeignKey('conversations.id'), nullable=False)
    
    user = db.relationship('User', back_populates='direct_messages')
