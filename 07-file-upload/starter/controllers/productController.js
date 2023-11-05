const Product = require('../models/Product');
const {StatusCodes} = require('http-status-codes');


const createProduct = async (req, res) => {
    res.send('create a product');
};

const getAllProducts = async (req, res) => {
    res.send('get all products');
};


module.exports = {
    createProduct,
    getAllProducts
}