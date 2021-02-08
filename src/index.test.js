const ioC = require('socket.io-client');
const { ioServer, allMessages, allUsers } = require('./index');

let ioClient, ioClient2;

// Close connection after all tests
afterAll((done) => {
  ioServer.close();
  done();
});

// // Create new client for each test
beforeEach((done) => {
  ioClient = ioC('http://localhost:8080');
  ioClient2 = ioC('http://localhost:8080');
  done();
});

// Close client connection
afterEach((done) => {
  ioClient.disconnect();
  ioClient2.disconnect();
  done();
});

describe('Messenger App', () => {
  test('ioServer emits on connection, client listens', (done) => {
    ioServer.on('connection', (serverSocket) => {
      expect(serverSocket).toBeDefined();
      expect(allMessages.length).toBe(0);
      done();
    });
  });
  test('ioServer saves new user when client sends new_user ', (done) => {
    ioServer.on('new_user', (name) => {
      const newUser = allUsers.find((user) => user.name === name);
      expect(newUser.name).toBe('Hermione');
    });
    ioClient.emit('new_user', 'Hermione');
    done();
  });
  test('ioServer saves new message when client sends new_message ', (done) => {
    ioClient2.on('connect', () => {
      ioClient.emit('new_message', {
        receiverId: ioClient2.id,
        message: 'Apple',
      });
      ioClient.emit('get_messages');

      ioClient.on('send_messages', (res) => {
        const newMessage = res.find((message) => message.message === 'Apple');
        expect(newMessage.message).toBe('Apple');
      });
    });
    done();
  });

  test('retrieves messages for client', (done) => {
    ioClient.on('connect', () => {
      ioClient2.emit('new_message', {
        receiverId: ioClient.id,
        message: 'Banana',
      });
      ioClient2.emit('new_message', {
        receiverId: ioClient.id,
        message: 'Toast',
      });
      ioClient2.emit('get_messages');

      ioClient2.on('send_messages', (res) => {
        expect(res.length).toBe(2);
        done();
      });
    });
  });
});
