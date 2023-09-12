"use strict";

const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("public"));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const rooms = ['room1', 'room2', 'room3'];

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);
  socket.emit('rooms', rooms);

  socket.on('joinRoom', (data) => {
    const { roomName, nickname } = data;
    
    if (rooms.includes(roomName) && nickname) {
      if (socket.room) {
        socket.leave(socket.room);
      }

      socket.join(roomName);
      socket.room = roomName;
      socket.nickname = nickname;

      socket.emit('message', `You joined ${roomName}`);
      socket.to(roomName).emit('message', `${socket.nickname} joined ${roomName}`);
    }
  });

  socket.on("disconnect", () => {
    console.log("a user disconnected", socket.id);
    if (socket.room) {
      socket.to(socket.room).emit('message', `${socket.nickname} left ${socket.room}`);
    }
  });

  socket.on("chat message", (msg) => {
    console.log("message: ", msg);
    io.emit("chat message", msg);

  });
});

http.listen(3000, () => {
  console.log("listening on port 3000");
});