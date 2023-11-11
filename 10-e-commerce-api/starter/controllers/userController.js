const User = require('../models/User');
const {StatusCodes} = require('http-status-codes');
const CustomError = require('../errors');


const getAllUsers = async (req, res) => {
    console.log(req.user)

    const users = await User.find({role: 'user'}).select('-password');
    res.status(StatusCodes.OK).json({users});
};

const getSingleUser = async (req, res) => {    
    const user = await User.findOne({_id: req.params.id}).select('-password');
    if (!user) {
        throw new CustomError.NotFoundError('User is not found');
    }
    res.status(StatusCodes.OK).json({user});

};

const showCurrentUser = async (req, res) => {
    res.status(StatusCodes.OK).json({user: req.user});
};

const updateUser = async (req, res) => {
    res.send(req.body);
};

const updateUserPassword = async (req, res) => {
    const {oldPassword, newPassword} = req.body;

    if (!oldPassword || !newPassword) {
        throw new CustomError.BadRequestError('Please provide password.')
    };

    const user = await User.findOne({_id: req.user.userId});
    const isOldPasswordValid = await user.comparePassword(oldPassword);
    if (!isOldPasswordValid) {
        throw new CustomError.UnauthenticatedError('Incorrect password');
    };
    user.password = newPassword;
    await user.save()

    res.status(StatusCodes.OK).json({user, msg: 'Password changed!'})
};


module.exports = {
    getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword,
}
