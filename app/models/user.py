from .db import db
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from .server_member import server_members
from .conversation import conversations


class User(db.Model, UserMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(40), nullable=False, unique=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    hashed_password = db.Column(db.String(255), nullable=False)
    profile_image = db.Column(db.String(255))
    last_visited = db.Column(db.String(255))

    conversations = db.relationship(
        "User", 
        secondary=conversations,
        primaryjoin=id==conversations.c.to_user,
        secondaryjoin=id==conversations.c.from_user,
        backref=db.backref("conversing"),
    )
    direct_messages = db.relationship('Direct_Message', back_populates='user')
    messages = db.relationship('Message', back_populates='user')

    servers = db.relationship(
        'Server',
        secondary=server_members,
        back_populates='users'
    )

    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def get_conversations(self):
        return self.conversations

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'profile_image': self.profile_image,
            # 'conversations': self.conversations,
        }
