const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const usersRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const friendsRoutes = require('./routes/friends');

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/friends', friendsRoutes);

// Serve profile images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Socket.IO
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Map to track userId -> socketId
const connectedUsers = new Map();

io.on('connection', (socket) => {
  console.log('🔌 New client connected:', socket.id);

  // Register user
  socket.on('register', (userId) => {
    connectedUsers.set(userId, socket.id);
    console.log(`✅ Registered user: ${userId} with socket: ${socket.id}`);
  });

  // Handle invite
  socket.on('send_invite', ({ from, to }) => {
    const toSocketId = connectedUsers.get(to.id); // ✅ use to.id
    if (toSocketId) {
      io.to(toSocketId).emit('receive_invite', { from });
      console.log(`📨 Invite sent from ${from.username} to ${to.username}`);
    } else {
      console.log(`⚠️ Invite failed — user ${to.username} not connected`);
    }
  });

  // Accept invite
  socket.on('accept_invite', ({ from, to }) => {
    const fromSocketId = connectedUsers.get(from);
    if (fromSocketId) {
      io.to(fromSocketId).emit('invite_accepted', { by: to });
      console.log(`✅ ${to.username} accepted invite from ${from}`);
    }
  });

  // Private messages
  socket.on('send-private-message', ({ to, message }) => {
    const toSocketId = connectedUsers.get(to);
    if (toSocketId) {
      io.to(toSocketId).emit('receive-private-message', message);
      console.log(`📬 Private message sent from ${message.senderId} to ${to}`);
    } else {
      console.log(`⚠️ Private message failed — user ${to} not connected`);
    }
  });

  // Disconnect cleanup
  socket.on('disconnect', () => {
    for (const [userId, sockId] of connectedUsers.entries()) {
      if (sockId === socket.id) {
        connectedUsers.delete(userId);
        console.log(`❌ User disconnected: ${userId}`);
        break;
      }
    }
  });
});

// Debug
console.log("Loaded env keys:", Object.keys(process.env));
console.log("ATLAS_URI:", process.env.ATLAS_URI);

// MongoDB
mongoose.connect(process.env.ATLAS_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
  console.log('✅ Connected to MongoDB Atlas');

  const db = mongoose.connection.db;
  const collections = await db.listCollections().toArray();
  console.log('📦 Collections:');
  collections.forEach(col => console.log(` - ${col.name}`));

  const admin = db.admin();
  const result = await admin.listDatabases();
  console.log('🗃️ Databases:');
  result.databases.forEach(db => console.log(` - ${db.name}`));
})
.catch((err) => console.error('❌ MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
