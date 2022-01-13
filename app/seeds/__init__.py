from flask.cli import AppGroup

from .servers import seed_servers,undo_servers
from .users import seed_users, undo_users
from .channels import seed_channels, undo_channels
from .conversations import seed_conversations, undo_conversations
from .messages import seed_messages, undo_messages
from .direct_messages import seed_direct_messages, undo_direct_messages

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')


# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    seed_users()
    seed_servers()
    seed_channels()
    seed_conversations()
    # Add other seed functions here
    seed_messages()
    seed_direct_messages()


# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    undo_users()
    undo_messages()
    undo_channels()
    # Add other undo functions here
    undo_servers()
    undo_direct_messages()
    undo_conversations()
