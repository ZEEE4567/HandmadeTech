const Products = require('./products');
const ProductsService = require('./service');

const service = ProductsService(Products);

module.exports = service;