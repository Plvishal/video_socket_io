const { Server } = require('socket.io');
const io = new Server(8000, {
  cors: true,
});
const emailToSocketIdMap = new Map();

const socketIdTOEmailMap = new Map();
io.on('connection', (socket) => {
  console.log(`Socket COnnected`, socket.id);
  socket.on('room:join', (data) => {
    const { email, room } = data;
    emailToSocketIdMap.set(email, socket.id);
    socketIdTOEmailMap.set(socket.id, email);
    io.to(room).emit('user:join', { email, id: socket.id });
    socket.join(room);
    io.to(socket.id).emit('room:join', data);
  });
});
