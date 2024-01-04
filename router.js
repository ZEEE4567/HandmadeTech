let AuthAPI = require('./server/auth');
let UsersAPI = require('./server/users');
let ProductsAPI = require('./server/products')

const express = require('express');

function init (io) {
    let api = express();

    api.use('/auth', AuthAPI());
    api.use('/users', UsersAPI());
    api.use('/products', ProductsAPI());

    return api;
}

module.exports = {
    init: init,
}
