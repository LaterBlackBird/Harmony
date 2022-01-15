from app.models import db, User


# Adds a demo user, you can add other users here if you want
def seed_users():
    demo = User(
        username='Demo', email='demo@aa.io', password='password', profile_image='https://humbleimages.s3.amazonaws.com/7d2414de391e414391c6242c1b4b2c7f.jpg')
    marnie = User(
        username='marnie', email='marnie@aa.io', password='password', profile_image='https://humbleimages.s3.amazonaws.com/ccce5ff01d58411c82baefdd069397f7.jpg')
    bobbie = User(
        username='bobbie', email='bobbie@aa.io', password='password', profile_image='https://humbleimages.s3.amazonaws.com/ecb82a5a65ee4f8b9bb31e3853246ff1.jpg')

    db.session.add(demo)
    db.session.add(marnie)
    db.session.add(bobbie)

    db.session.commit()


# Uses a raw SQL query to TRUNCATE the users table.
# SQLAlchemy doesn't have a built in function to do this
# TRUNCATE Removes all the data from the table, and RESET IDENTITY
# resets the auto incrementing primary key, CASCADE deletes any
# dependent entities
def undo_users():
    db.session.execute('TRUNCATE users RESTART IDENTITY CASCADE;')
    db.session.commit()
