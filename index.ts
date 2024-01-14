import http from 'http';
import path from "path";
import express, { Express } from 'express';
import mongoose from 'mongoose';
import { Server } from 'socket.io';

import config from './config';
import router from './router';

const app: Express = express();

const hostname: string = '127.0.0.1';
const port: number = 5000;

mongoose.set('strictQuery', false)
    .connect(config.db)
    .then(() => console.log('Connection successful!'))
    .catch((err: Error) => console.error(err));

const httpServer = http.createServer(app);
const io = new Server(httpServer);

io.on('connection', (socket) => {
    console.log('Socket, new connection', socket.id);

    socket.on('disconnect', () => {
        console.log('🔥: A user disconnected');
        socket.disconnect();
    });
});

app.use(router.init(io));

//app.use('/images', express.static(path.join(__dirname, 'images')));

httpServer.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}`);
});
