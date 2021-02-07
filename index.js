const app = require('express')();
const server = require('http').createServer(app);
const port = 8080;
const io = require('socket.io')(server);
server.listen(port);

// helpers
const filterLastMonth = (message) => {
  const today = new Date();
  const differenceInDays = Math.floor(
    (today - message.date) / (1000 * 60 * 60 * 24)
  );
  return differenceInDays <= 30;
};

let allMessages = [];
let allUsers = [];

io.on('connection', (socket) => {
  // on initial connection
  socket.emit('chat_started', console.log({ allMessages }));

  // on new user joining
  socket.on('new_user', (name) => {
    let newUser = { id: allUsers.length + 1, name };
    allUsers.push(newUser);
    if (allUsers.length === 2) {
      socket.emit('limit_met');
    }
  });

  // on user sending a message
  socket.on('new_message', ({ sender, receiver, message }) => {
    allMessages.push({ sender, receiver, message, date: new Date() });
  });

  // on message retrieve request
  socket.on('get_messages', (senderId, receiverId) => {
    const filteredMessages = allMessages.filter(
      (message) =>
        message.senderId === senderId &&
        message.receiverId === receiverId &&
        filterLastMonth(message)
    );
    return filteredMessages.slice(0, 100);
  });
});

io.on('disconnect', () => {
  allMessages = [];
  allUsers = [];
});

console.log('Server running on port 8080');
