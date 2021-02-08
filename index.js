const app = require('express')();
const server = require('http').createServer(app);
const port = 8080;
const io = require('socket.io')(server);
server.listen(port);

// routing
app.get('/', (req, res) => {
  res.sendFile('public/index.html', { root: __dirname });
});

app.get('/get-messages/:senderId?', (req, res) => {
  if (!req.params.senderId) {
    res.send(allMessages.filter(filterLastMonth).slice(0, 100));
  } else {
    const filteredMessages = allMessages.filter(
      (message) =>
        message.senderId === req.params.senderId &&
        message.receiverId === socket.id &&
        filterLastMonth(message)
    );
    res.send(filteredMessages.slice(0, 100));
  }
});

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
  socket.emit('chat_started', allUsers);

  // on new user joining
  socket.on('new_user', (name) => {
    let newUser = { id: socket.id, name };
    allUsers.push(newUser);
    socket.broadcast.emit('new_user', allUsers[allUsers.length - 1]);
  });

  // on user sending a message
  socket.on('new_message', ({ receiverId, message }) => {
    allMessages.push({
      senderId: socket.id,
      receiverId,
      message,
      date: new Date(),
    });
    socket.broadcast.emit('new_message', message);
  });

  // on message retrieve request
  socket.on('get_messages', (senderId) => {
    if (!senderId) {
      socket.emit(
        'send_messages',
        allMessages.filter(filterLastMonth).slice(0, 100)
      );
    } else {
      const filteredMessages = allMessages.filter(
        (message) =>
          message.senderId === senderId &&
          message.receiverId === socket.id &&
          filterLastMonth(message)
      );
      socket.emit('send_messages', filteredMessages.slice(0, 100));
    }
  });
  socket.on('disconnect', () => {
    allMessages = [];
    allUsers = [];
  });
});

console.log('Server running on port 8080');

module.exports = { ioServer: io, allMessages, allUsers };
