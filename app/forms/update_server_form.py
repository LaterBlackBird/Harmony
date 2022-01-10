from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired


class UpdateServerForm(FlaskForm):
  server_name = StringField('server_name', validators=[DataRequired()])
  server_image = StringField('server_image')
