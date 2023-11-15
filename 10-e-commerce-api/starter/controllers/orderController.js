const Order = require('../models/Order');
const Product = require('../models/Product');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const {checkPermissions} = require('../utils');


const fakeStripeAPI = async ({amount, currency}) => {
    const client_secret = 'someRandomValue';
    return {client_secret, amount};
}

const createOrder = async (req, res) => {
    // 1- check if everything is correct: product, price etc.
    // 2- communicate with Stripe
    // 3- create order

    const{items: cartItems, tax, shippingFee} = req.body;

    if (!cartItems || cartItems.length < 1) {
        throw new CustomError.BadRequestError('No cart items provided.');
    };

    if (!tax || !shippingFee) {
        throw new CustomError.BadRequestError('Please provide tax and shipping fee.');
    };

    // because of synchronous operation inside of loop we cannot use forEach or map(); 
    // set up for...of loop to run 'await' inside of the loop;
    let orderItems = [];
    let subtotal = 0;

    for (const item of cartItems) {
        const dbProduct = await Product.findOne({_id: item.product});

        if (!dbProduct) {
        throw new CustomError.NotFoundError(`Product with id ${item.product} is not found.`);
        }

        const {name, image, price, _id} = dbProduct;
        const singleOrderItem = {
            amount: item.amount,
            name,
            price,
            image,
            product: _id,
        };
        // add item to order
        orderItems = [...orderItems, singleOrderItem];
        subtotal += item.amount * price;                
    };
    const total = tax + shippingFee + subtotal;

    // 2- communicate w/Stripe to get client secret
    // for this project use fake func, without Stripe lib
    const paymentIntent = await fakeStripeAPI({
        amount: total,
        currency: 'usd',
    });

    // 3- create order
    const order = await Order.create({
        orderItems,
        total,
        subtotal,
        tax,
        shippingFee,
        clientSecret: paymentIntent.client_secret,
        user: req.user.userId,
    });

    res.status(StatusCodes.CREATED).json({order, clientSecret: order.clientSecret});
};

const getAllOrders = async (req, res) => {
    res.send('get all orders');
};

const getSingleOrder = async (req, res) => {
    res.send('get single order');
};

const getCurrentUserOrders = async (req, res) => {
    res.send('get current user order');
};


const updateOrder = async (req, res) => {
    res.send('update order');
};


module.exports = {
    getAllOrders,
    getSingleOrder, 
    getCurrentUserOrders,
    createOrder, 
    updateOrder
}