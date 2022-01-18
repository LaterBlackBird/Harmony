# Harmony
https://harmony-aug21.herokuapp.com

## About Harmony

Harmony is a discord clone with a simple UI. It focuses on instant delivery of messages between groups of people. In Harmony there are two main ways to interact with other users, directly and via group messaging. Two people can interact with each other through private conversations initiated by either party or in a server room where they can participate in discussions across multiple channels.

Here is an example of a direct conversation:
![dm](https://bl3302files.storage.live.com/y4mTPd3XoKTYlI4b7NzT6uSCKbhNBfF7Pc0NKz7bkIC1TkGWRlIytSFTCsQBZ11RWQa9CoZ5_R7MHv1JOPXqq8GEGj7F5zHpZspkiHjHlB13GSqhNrLwf0HshOhA7rzjmvBbuoAQAZFQ3CqziVTp0lKW6giyINnAYoyd87lYWVpaEQfPOe75XJhdIzkOcO6ErMq?width=1920&height=1056&cropmode=none)

Here is an example of a channel conversation:
![sm](https://bl3302files.storage.live.com/y4mvE_c9KzCopqbspXH0A2ryvQv-HVTPaaw4NVTxap-LcELX3IqpSUCB3kyRv7auYGcjYtY0KFQgmHp1CGVBcCqptGnc99HDXe1PA-OhSbpB0O2htDtytJ52BZOD-8K_3T2zF8grMxKx_2xdWOt-lfOjDE4J46tAXG_bvsKV_c7P7w8shSPklIvacv0eCXCOPzu?width=1920&height=1053&cropmode=none)

This is the starter for the Harmony project if you wish to make a fork of the application.

## Getting started

1. Clone this repository (only this branch)

   ```bash
   git clone https://github.com/appacademy-starters/python-project-starter.git
   ```

2. Install dependencies

      ```bash
      pipenv install --dev -r dev-requirements.txt && pipenv install -r requirements.txt
      ```

3. Create a **.env** file based on the example with proper settings for your
   development environment
4. Setup your PostgreSQL user, password and database and make sure it matches your **.env** file

5. Get into your pipenv, migrate your database, seed your database, and run your flask app

   ```bash
   pipenv shell
   ```

   ```bash
   flask db upgrade
   ```

   ```bash
   flask seed all
   ```

   ```bash
   flask run
   ```

6. To run the React App in development, checkout the [README](./react-app/README.md) inside the `react-app` directory.

***
*IMPORTANT!*
   If you add any python dependencies to your pipfiles, you'll need to regenerate your requirements.txt before deployment.
   You can do this by running:

   ```bash
   pipenv lock -r > requirements.txt
   ```

*ALSO IMPORTANT!*
   psycopg2-binary MUST remain a dev dependency because you can't install it on apline-linux.
   There is a layer in the Dockerfile that will install psycopg2 (not binary) for us.
***

## Deploy to Heroku

1. Before you deploy, don't forget to run the following command in order to
ensure that your production environment has all of your up-to-date
dependencies. You only have to run this command when you have installed new
Python packages since your last deployment, but if you aren't sure, it won't
hurt to run it again.

   ```bash
   pipenv lock -r > requirements.txt
   ```

2. Create a new project on Heroku
3. Under Resources click "Find more add-ons" and add the add on called "Heroku Postgres"
4. Install the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-command-line)
5. Run

   ```bash
   heroku login
   ```

6. Login to the heroku container registry

   ```bash
   heroku container:login
   ```

7. Update the `REACT_APP_BASE_URL` variable in the Dockerfile.
   This should be the full URL of your Heroku app: i.e. "https://flask-react-aa.herokuapp.com"
8. Push your docker container to heroku from the root directory of your project.
   (If you are using an M1 mac, follow [these steps below](#for-m1-mac-users) instead, then continue on to step 9.)
   This will build the Dockerfile and push the image to your heroku container registry.

   ```bash
   heroku container:push web -a {NAME_OF_HEROKU_APP}
   ```

9. Release your docker container to heroku

      ```bash
      heroku container:release web -a {NAME_OF_HEROKU_APP}
      ```

10. set up your database

      ```bash
      heroku run -a {NAME_OF_HEROKU_APP} flask db upgrade
      heroku run -a {NAME_OF_HEROKU_APP} flask seed all
      ```

11. Under Settings find "Config Vars" and add any additional/secret .env
variables.

12. profit

### For M1 Mac users

(Replaces **Step 8**)

1. Build image with linux platform for heroku servers. Replace
{NAME_OF_HEROKU_APP} with your own tag:

   ```bash=
   docker buildx build --platform linux/amd64 -t {NAME_OF_HEROKU_APP} .
   ```

2. Tag your app with the url for your apps registry. Make sure to use the name
of your Heroku app in the url and tag name:

   ```bash=2
   docker tag {NAME_OF_HEROKU_APP} registry.heroku.com/{NAME_OF_HEROKU_APP}/web
   ```

3. Use docker to push the image to the Heroku container registry:

   ```bash=3
   docker push registry.heroku.com/{NAME_OF_HEROKU_APP}/web
   ```
        
## Technical background

Harmony uses several frontend and backend technologies to make the application run. For Harmony to work, it uses:

### Frontend
- React
- Redux
- JSX
- CSS
- socket.io
- AWS S3 direct uploading

### Backend
- Python
- Flask
- SQLAlchemy
- PostgreSQL
- socket.io
- Docker
- Gunicorn
- Eventlet

## Implementation

These technologies interact seamlessly together and with use of docker, deployment is easy and reliable. One of the more challenging decisions was how to implement the connection to the S3 server. The two options are direct and passthrough uploading. Direct was chosen because it takes work off of the backend and would allow for useres to upload larger files quicker, which will become more important as more mediums, such as video files and 3D models, can be shared in the future.

## To-dos
Messaging is the core feature in Harmony. As such there are still future improvements that can be made on the messaging experience. Allowing rich text editing and image attachements will enhance the users experiences and the level at which they can communicate with each other. In addition, other mediums of communication could be added to Harmony in the future as well, such as live audio communication between users. Currently, Harmony only allows for private servers and messages, adding the ability to create a public server would also enhance user experience by allowing them to more easily find communities to join.

