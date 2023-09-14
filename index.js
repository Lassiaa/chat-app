"use strict";

const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("public"));

const users = [];
const rooms = ["room1", "room2", "room3"];

const getUserList = () => {
  let userList = "";
  for (const user of users) {
    userList += user.username + "\n";
  }
  return userList;
};

const getUserName = (socketId) => {
  return users.find((user) => user.id === socketId)?.username;
};

const deleteUserById = (socketId) => {
  try {
    const index = users.findIndex((user) => user.id === socketId);
    console.log("deleting user", users[index]);
    users.splice(index, 1);
  } catch (error) {
    console.warn("deleting user failed", error);
  }
};

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);
  socket.emit("rooms", rooms);

  socket.on("joinRoom", (data) => {
    const { roomName, nickname } = data;
    users.push({ username: nickname, id: socket.id, roomName });
    console.log(users);

    if (rooms.includes(roomName) && nickname) {
      if (socket.room) {
        socket.leave(socket.room);
      }

      socket.join(roomName);
      socket.room = roomName;
      socket.nickname = nickname;

      socket.emit("message", `You joined ${roomName}`);
      socket
        .to(roomName)
        .emit("message", `${socket.nickname} joined ${roomName}`);

      socket.on("chat message", (msg) => {
        console.log("message by: " + nickname, msg, " in ", roomName);
        if (msg === "!users") {
          socket.emit("chat message", `Users online: ${getUserList()}`);
        } else {
          io.emit("chat message", `${getUserName(socket.id)}: ${msg}`);
        }
      });
    }
  });

  socket.on("disconnect", () => {
    console.log(
      "a user disconnected",
      socket.nickname,
      socket.socketId,
      socket.room
    );
    if (socket.room) {
      socket
        .to(socket.room)
        .emit("message", `${socket.nickname} left ${socket.room}`);
      deleteUserById(socket.id);
    }
  });
});

http.listen(3000, () => {
  console.log("listening on port 3000");
});
