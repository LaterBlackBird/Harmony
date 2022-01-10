from flask.cli import AppGroup

from .servers import seed_servers,undo_servers
from .users import seed_users, undo_users
from .channels import seed_channels, undo_channels
from .messages import seed_messages, undo_messages

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')


# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    seed_users()
    seed_channels()
    # Add other seed functions here
    seed_servers()
    seed_messages()


# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    undo_users()
    undo_messages()
    undo_channels()
    # Add other undo functions here
    undo_servers()
