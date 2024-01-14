import express, {Express} from 'express';
import {Server} from 'socket.io';
import {UsersAPI} from "./data/routes/users";
import {ProductsAPI} from "./data/routes/products";



function init(io: Server): Express {
    const api: Express = express();


    api.use(UsersAPI());
    api.use(ProductsAPI());

    return api;
}

export default {
    init: init,
};