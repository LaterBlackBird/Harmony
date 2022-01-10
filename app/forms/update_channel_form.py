from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, ValidationError
from app.models import Channel


class EditChannel(FlaskForm):
    channel_name = StringField('Channel Name', validators=[DataRequired()])

