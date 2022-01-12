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

    def to_dict(self):
            return {
                'id': self.id,
                'server_name': self.server_name,
                'server_image': self.server_image,
                'users': [user.to_dict() for user in self.users]
            }

    def add_user(self, user):
        if user not in self.users:
            self.users.append(user)
            db.session.commit()
            return self

    def remove_user(self, user):
        if user in self.users:
            self.users.remove(user)
            db.session.commit()
            return self

