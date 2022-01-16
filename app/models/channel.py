from .db import db

class Channel(db.Model):
    __tablename__ = 'channels'

    id = db.Column(db.Integer, primary_key=True, nullable=False)
    channel_name = db.Column(db.String(50), nullable=False)
    server_id = db.Column(db.Integer, db.ForeignKey('servers.id'), nullable=False)

    messages = db.relationship('Message', cascade="all,delete", back_populates='channel')
    server = db.relationship('Server', back_populates='channels')


    def to_dict(self):
        return {
            'id': self.id,
            'channel_name': self.channel_name,
            'server_id': self.server_id
        }
