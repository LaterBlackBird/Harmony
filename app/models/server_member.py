from .db import db

server_members = db.Table(
    'server_members',
    db.Column(
        'user_id',
        db.Integer,
        db.ForeignKey('users.id'),
        primary_key=True
    ),
    db.Column(
        'server_id',
        db.Integer,
        db.ForeignKey('servers.id'),
        primary_key=True
    ),
    db.Column(
        'admin',
        db.Boolean,
        server_default='false'
    )

)

class Server_Members(object):
    def __init__(self,server_id, user_id, admin):
        self.server_id = server_id
        self.user_id = user_id
        self.admin = admin

    def to_dict(self):
        return {
            'server_id': self.server_id,
            'user_id': self.user_id,
            'admin': self.admin,
        }

db.mapper(Server_Members, server_members)
