from app.models import db, Conversation


# Adds a demo user, you can add other users here if you want
def seed_conversations():
    conversation1 = Conversation(
        to_user=1, from_user=2)
    conversation2 = Conversation(
        to_user=1, from_user=2)
    conversation3 = Conversation(
        to_user=1, from_user=2)

    db.session.add(conversation1)
    db.session.add(conversation2)
    db.session.add(conversation3)

    db.session.commit()


# Uses a raw SQL query to TRUNCATE the users table.
# SQLAlchemy doesn't have a built in function to do this
# TRUNCATE Removes all the data from the table, and RESET IDENTITY
# resets the auto incrementing primary key, CASCADE deletes any
# dependent entities
def undo_conversations():
    db.session.execute('TRUNCATE channels RESTART IDENTITY CASCADE;')
    db.session.commit()