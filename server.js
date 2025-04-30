// server.js
import express from 'express';
import http from 'http';
import { v4 as uuid4 } from 'uuid';
import { Server } from 'socket.io';

const app = express();


const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",  
        methods: ["GET", "POST", "OPTIONS", "PUT", "DELETE", "PATCH"]
    }
});

// Store usernames and rooms
const userMap = new Map(); // socket.id -> username
const rooms = new Map(); // call_id -> Map(socket.id -> username)

io.on('connection', (socket) => {
  socket.on('set-username', (username) => {
    console.log('Received username:', username, 'for socket:', socket.id);
    userMap.set(socket.id, username);
  });

  socket.on('join-call', (call_id) => {
    socket.join(call_id);

    // Initialize room if it doesn't exist
    if (!rooms.has(call_id)) {
      rooms.set(call_id, new Map());
    }

    // Store participant's username
    const username = userMap.get(socket.id) || `Participant ${socket.id.slice(0, 4)}`;
    rooms.get(call_id).set(socket.id, username);

    // Notify existing participants about the new participant
    socket.to(call_id).emit('new-socket', socket.id, username);

    // Send the list of existing participants to the new participant
    const participants = rooms.get(call_id);
    socket.emit('participants', Array.from(participants.entries())); // [socketId, username] pairs
  });

  socket.on('offer', (data) => {
    socket.to(data.to).emit('recive-offer', { from: socket.id, offer: data.offer });
  });

  socket.on('answer', (data) => {
    socket.to(data.to).emit('recive-answer', { from: socket.id, answer: data.answer });
  });

  socket.on('icecandidate', (data) => {
    socket.to(data.to).emit('recive-icecandidate', { from: socket.id, candidate: data.candidate });
  });

  // Screen sharing events
  socket.on('start-screen-share', (call_id) => {
    socket.to(call_id).emit('start-screen-share', socket.id);
  });

  socket.on('stop-screen-share', (call_id) => {
    socket.to(call_id).emit('stop-screen-share', socket.id);
  });

  // Streaming
  socket.on('create-stream', (stream_id) => {
    socket.join(stream_id);
  });

  socket.on('join-stream', async (stream_id) => {
    socket.join(stream_id);
    socket.to(stream_id).emit('new-socket', socket.id);

    const viewersCount = await io.in(stream_id).fetchSockets();
    io.to(stream_id).emit('viewers-count', viewersCount.length);
  });

  // StreamChat
  socket.on('chat-message', (data) => {
    io.to(data.to).emit('brodcast-message', { message: data.message, from: socket.id });
  });

  // One-One chat
  socket.on('personal-chat', (data) => {
    const username = userMap.get(socket.id); // Get the username from the userMap
    io.to(data.to).emit('receive-personal-message', { message: data.message, from: socket.id, username });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    userMap.delete(socket.id);
    // Remove participant from rooms
    for (const [call_id, participants] of rooms.entries()) {
      if (participants.has(socket.id)) {
        participants.delete(socket.id);
        io.to(call_id).emit('participant-left', socket.id);
        if (participants.size === 0) {
          rooms.delete(call_id);
        }
        break;
      }
    }
  });
});

// Express routes
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/call', (req, res) => {
  res.redirect(`call/${uuid4()}`);
});

app.get('/call/:call_id', (req, res) => {
  const data = {
    call_id: req.params.call_id,
  };
  res.render('call', data);
});

app.get('/stream', (req, res) => {
  res.redirect(`stream/${uuid4()}?streamer=true`);
});

app.get('/stream/:stream_id', (req, res) => {
  const data = {
    stream_id: req.params.stream_id,
  };
  res.render('stream', data);
});

server.listen(2000, () => console.log('Server running on port 2000'));