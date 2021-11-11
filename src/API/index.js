//Setup do Express
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const PORT = 3001;

//Setup do Socket.IO
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/api', (req, res) => {
    res.json({ message: "Hello from server!" });
});

io.on('connection', (socket) => {
    console.log('a user connected');
});

server.listen(PORT, () => {
    console.log('listening on *:3001');
});