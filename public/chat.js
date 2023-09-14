"use strict";

const socket = io("http://localhost:3000");

const roomList = document.getElementById("roomList");
const user = document.getElementById("u");
const joinButton = document.getElementById("joinButton");
const inp = document.getElementById("m");
const mForm = document.getElementById("mForm");
const uForm = document.getElementById("uForm");
document.getElementById("chat").classList = "hidden";

socket.on("rooms", (availableRooms) => {
  const roomList = document.getElementById("roomList");

  availableRooms.forEach((roomName) => {
    const option = document.createElement("option");
    option.value = roomName;
    option.text = roomName;
    roomList.appendChild(option);
  });
});

mForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (inp.value) {
    socket.emit("chat message", inp.value);
    inp.value = "";
  }
});

uForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (user.value) {
    const selectedRoom = roomList.value;
    const nickname = user.value;
    socket.emit("joinRoom", { roomName: selectedRoom, nickname });
    document.getElementById("login").classList = "hidden";
    document.getElementById("chat").classList = "";
    inp.focus();
  }
});

socket.on("chat message", (msg) => {
  const item = document.createElement("li");
  item.innerHTML = msg;
  document.getElementById("messages").appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});
