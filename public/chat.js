"use strict";

const socket = io("http://localhost:3000");

const roomList = document.getElementById('roomList');
const user = document.getElementById('u');
const joinButton = document.getElementById('joinButton');
const inp = document.getElementById("m");

joinButton.addEventListener('click', () => {
  const selectedRoom = roomList.value;
  const nickname = user.value;
  socket.emit('joinRoom', { roomName: selectedRoom, nickname });
});

socket.on('rooms', (availableRooms) => {
  const roomList = document.getElementById('roomList');

  availableRooms.forEach((roomName) => {
    const option = document.createElement('option');
    option.value = roomName;
    option.text = roomName;
    roomList.appendChild(option);
  });
});

document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault();
  if (user.value && inp.value) {
    socket.emit("chat message", user.value + ": " + inp.value);
    inp.value = "";
  }
});

socket.on("chat message", (msg) => {
  const item = document.createElement("li");
  item.innerHTML = msg;
  document.getElementById("messages").appendChild(item);
});
