from .db import db
from .server_member import server_members

class Server(db.Model):
    __tablename__ = 'servers'

    id = db.Column(db.Integer, primary_key=True, nullable=False)
    server_name = db.Column(db.String(100), nullable=False, unique=True)
    server_image = db.Column(db.String(255))

    channels = db.relationship('Channel', back_populates='server')

    users = db.relationship(
        'User',
        secondary=server_members,
        back_populates='servers'
    )