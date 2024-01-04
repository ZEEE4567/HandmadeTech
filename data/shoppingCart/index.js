const ShoppingCart = require('./shoppingCart');
const ShoppingCartService = require('./service');

const service = ShoppingCartService(ShoppingCart);

module.exports = service;
