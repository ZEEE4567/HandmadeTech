const cors = require('cors');
const http = require('http');
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const socketIo = require('socket.io');

const config = require('./config');
let router = require('./router');
var app = express();

const hostname = '127.0.0.1';
const port = 3000;

mongoose.set('strictQuery', false)
    .connect(config.db)
    .then(() => console.log('Conection successful!'))
    .catch((err) => console.error(err));

//app.use(cors());



const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: 'https://*:*',
    },
});

io.on('connection', (socket) => {
    console.log('Socket, new connection', socket.id);

    socket.on('disconnect', () => {
        console.log('🔥: A user disconnected');
        socket.disconnect();
    });
});

app.use(router.init(io));
app.use('/images', express.static(path.join(__dirname, 'images')));

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}`);
});
