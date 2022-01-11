from app.models import db, Message


# Adds a demo user, you can add other users here if you want
def seed_messages():
    message1 = Message(
        content='Message 1', user_id=1, channel_id=1)
    message2 = Message(
        content='Message 2', user_id=2, channel_id=1)
    message3 = Message(
        content='Message 3', user_id=1, channel_id=1)

    db.session.add(message1)
    db.session.add(message2)
    db.session.add(message3)

    db.session.commit()


# Uses a raw SQL query to TRUNCATE the users table.
# SQLAlchemy doesn't have a built in function to do this
# TRUNCATE Removes all the data from the table, and RESET IDENTITY
# resets the auto incrementing primary key, CASCADE deletes any
# dependent entities
def undo_messages():
    db.session.execute('TRUNCATE messages RESTART IDENTITY CASCADE;')
    db.session.commit()