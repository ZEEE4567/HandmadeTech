import express, {Express} from 'express';
import {Server} from 'socket.io';
import AuthAPI from './data/routers/auth';
import UsersAPI from './data/routers/users';
import ProductsAPI from './data/routers/products';

function init(io: Server): Express {
    const api: Express = express();

    api.use('/auth', AuthAPI());
    api.use('/users', UsersAPI());
    api.use('/products', ProductsAPI());

    return api;
}

export default {
    init: init,
};