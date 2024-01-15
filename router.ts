import express, {Express} from 'express';
import {Server} from 'socket.io';
import {UsersAPI} from "./data/routes/users";
import {ProductsAPI} from "./data/routes/products";
import {CategoryAPI} from "./data/routes/categories";
import {ShoppingCartAPI} from "./data/routes/shoppingCart";
import {AdminAPI} from "./data/routes/admin";



function init(io: Server): Express {
    const api: Express = express();


    api.use(UsersAPI());
    api.use(ProductsAPI());
    api.use(CategoryAPI());
    api.use(ShoppingCartAPI());
    api.use(AdminAPI());

    return api;
}

export default {
    init: init,
};