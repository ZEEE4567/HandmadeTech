import cors from 'cors';
import http from 'http';
import path from 'path';
import express, {Express} from 'express';
import mongoose from 'mongoose';
import SocketIo from 'socket.io';

import config from './config';
import router from './router';

const app: Express = express();

const hostname: string = '127.0.0.1';
const port: number = 3000;

mongoose.set('strictQuery', false)
    .connect(config.db)
    .then(() => console.log('Conection successful!'))
    .catch((err: Error) => console.error(err));

const server: http.Server = http.createServer(app);
const io: SocketIo.Server = SocketIo(server, {
    cors: {
        origin: 'https://*:*',
    },
});

io.on('connection', (socket: SocketIo.Socket) => {
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