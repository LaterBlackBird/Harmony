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