from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField
from wtforms.validators import DataRequired, ValidationError
from app.models import Channel


class ChannelForm(FlaskForm):
    channel_name = StringField('channel_name', validators=[DataRequired()])
    server_id = IntegerField('server_id')
