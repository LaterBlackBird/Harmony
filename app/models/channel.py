from .db import db

class Channel(db.Model):
    __tablename__ = 'channels'

    id = db.Column(db.Integer, primary_key=True, nullable=False)
    channel_name = db.Column(db.String(50), nullable=False)
    server_id = db.Column(db.Integer, db.ForeignKey('servers.id'), nullable=False)

    messages = db.relationship('Message', back_populates='channel')
    server = db.relationship('Server', back_populates='channels')