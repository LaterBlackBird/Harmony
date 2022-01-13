from app.models import db, Direct_Message


# Adds a demo user, you can add other users here if you want
def seed_direct_messages():
    direct_message1 = Direct_Message(
        content='Direct_Message 1', user_id=1, conversation_id=1)
    direct_message2 = Direct_Message(
        content='Direct_Message 2', user_id=2, conversation_id=1)
    direct_message3 = Direct_Message(
        content='Direct_Message 3', user_id=1, conversation_id=1)

    db.session.add(direct_message1)
    db.session.add(direct_message2)
    db.session.add(direct_message3)

    db.session.commit()


# Uses a raw SQL query to TRUNCATE the users table.
# SQLAlchemy doesn't have a built in function to do this
# TRUNCATE Removes all the data from the table, and RESET IDENTITY
# resets the auto incrementing primary key, CASCADE deletes any
# dependent entities
def undo_direct_messages():
    db.session.execute('TRUNCATE direct_messages RESTART IDENTITY CASCADE;')
    db.session.commit()