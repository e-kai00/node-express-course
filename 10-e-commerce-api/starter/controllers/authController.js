const User = require('../models/User');
const {StatusCodes} = require('http-status-codes');
const CustomError = require('../errors');
const {attachCookiesToResponse} = require('../utils')


const register = async (req, res) => {
    const {email, name, password} = req.body;

    // check for unique email
    const emailAlreadyExists = await User.findOne({email});
    if (emailAlreadyExists) {
        throw new CustomError.BadRequestError('Email already exists.')
    }

    // 1st registred user is admin
    const isFirstUser = await User.countDocuments({}) === 0;
    const role = isFirstUser ? 'admin' : 'user';

    // create user
    const user = await User.create({name, password, email, role});

    // issue tocken
    const tokenUser = {name: user.name, userId: user._id, role: user.role};
    attachCookiesToResponse({res, user: tokenUser});

    res.status(StatusCodes.CREATED).json({user: tokenUser});
};

const login = async (req, res) => {
    const {email, password} = req.body;
    if (!email || !password) {
        throw new CustomError.BadRequestError('Please enter valid email and password');
    };

    const user = await User.findOne({email});
    if (!user) {
        throw new CustomError.UnauthenticatedError('Invalid Credentials.');
    };

    const isPasswordValid = await user.comparePassword(password);
    if (!password) {
        throw new CustomError.UnauthenticatedError('Incorrect password');
    };

    const tokenUser = {name: user.name, userId: user._id, role: user.role};
    attachCookiesToResponse({res, user: tokenUser});
    res.status(StatusCodes.OK).json({user: tokenUser});

};

const logout = async (req, res) => {
    res. send('logout user')
};


module.exports = {
    register,
    login,
    logout,
}