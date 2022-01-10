from app.models import db, Server


def seed_servers():
  server1 = Server(
    server_name='server1', server_image='https://cdn.discordapp.com/attachments/927725788231520256/928025179735613511/logo.png'
  )
  server2 = Server(
    server_name='server2', server_image='https://cdn.discordapp.com/attachments/927725788231520256/928025179735613511/logo.png'
  )

  db.session.add(server1)
  db.session.add(server2)

  db.session.commit()


def undo_servers():
  db.session.execute('TRUNCATE servers RESTART IDENTITY CASCADE;')
  db.session.commit()

