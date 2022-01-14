from flask import Blueprint, jsonify
from flask_login import login_required
from app.models import db, User, Server_Members, Channel


user_routes = Blueprint('users', __name__)


@user_routes.route('/')
@login_required
def users():
    users = User.query.all()
    return {'users': [user.to_dict() for user in users]}

@user_routes.route('/<username>')
@login_required
def users_filtered(username):
    users = User.query.filter(User.username.ilike(f'{username}%')).all()
    return {'users': [user.to_dict() for user in users]}

@user_routes.route('/members/<int:server_id>')
@login_required
def users_filtered_members(server_id):
    members = db.session.query(Server_Members).filter(Server_Members.server_id == server_id).all()
    users = []
    for member in members:
        users.append(User.query.get_or_404(member.user_id))
    return {'users': [user.to_dict() for user in users]}

@user_routes.route('/<int:user_id>/<int:server_id>/validate_admin')
@login_required
def user_admin_validate(user_id, server_id):
    member = db.session.query(Server_Members).filter(Server_Members.user_id == user_id, Server_Members.server_id == server_id).all()
    if member:
        return member[0].to_dict()
    else:
        return {'admin': False}

@user_routes.route('/<int:id>')
@login_required
def user(id):
    user = User.query.get(id)
    return user.to_dict()
