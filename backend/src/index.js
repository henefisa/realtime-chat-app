const express = require("express");
const app = express();

const port = 8888;
const server = require("http").Server(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

server.listen(port, () => {
  console.log(`Server running in port ${port}`);
});

io.on("connection", (socket) => {
  console.log(socket.id, " connected");

  socket.emit("id", socket.id);

  socket.on("disconnect", () => {
    console.log(socket.id, " disconnected");
  });

  socket.on("new-message", (data) => {
    io.sockets.emit("new-message", { data, id: socket.id });
  });
});

app.get("/", (req, res) => {
  res.send("Home page. Server running okay.");
});
