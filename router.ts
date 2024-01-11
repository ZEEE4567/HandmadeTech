import express, {Express} from 'express';
import {Server} from 'socket.io';
import {AuthRouter} from './data/controllers/userController';



function init(io: Server): Express {
    const api: Express = express();

    api.use('/auth', AuthRouter());
    //api.use('/users', UsersAPI());
    // api.use('/products', ProductsAPI());

    return api;
}

export default {
    init: init,
};