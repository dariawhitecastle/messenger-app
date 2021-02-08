# messenger-app

Messenger API for a web app to enable chat between two users

## App features

- On load, a user can add their name.
- Once another user joins the chat room, their name will be seen by all other
  users currently in the chat.
- A user can submit a short message.
- Once the message is submitted, all users currently in the room can see it.
- All messages can be retrieved for a specific sender by calling the endpoint
  /all-messages
- If no parameter is provided, all messages for the last 30 days are retrieved
- If optional senderId is provided, messages for the current user from sender,
  will be retrieved
- Messages are sent for the last 30 days or the first 100.

## Technologies used for the app
- Node.js v.14  - JS runtime env https://nodejs.org/en/
- Socket.io - Server and Client (for testing) WebSockets https://socket.io/
- Express - Node.js Framework https://expressjs.com/
- Jest - a delightful JS library for testing https://jestjs.io/
- Docker - containerization for all https://www.docker.com/

## start the app

```
yarn docker
```

App is now running on port 8081. A minimally styled UI can be viewed and
interacted with for testing purposes.
- Open two browser tabs
- Intereact with the app to view the features 

## test the app

```
yarn docker-test
```

This will run `yarn test` inside a docker container and you can see passing
tests

## Scripts available
```
yarn docker-run
```
run container if built previously
```
yarn test
```
run tests outside docker
```
yarn dev
```
run dev server
```
yarn start
```
start the IO server
