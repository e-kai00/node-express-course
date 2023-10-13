const User = require('../models/User')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError, UnauthenticatedError} = require('../errors')
const { use } = require('express/lib/router')


const register = async (req, res) => {
    // create user
    const user = await User.create({...req.body})
    const tocken = user.createJWT()

    res.status(StatusCodes.CREATED).json({user: {name: user.name}, tocken})
}


const login = async (req, res) => {
    const {email, password} = req.body
    if (!email || !password) {
        throw new BadRequestError('Please provide email and password')
    }

    const user = await User.findOne({email})
    if (!user) {
        throw new UnauthenticatedError('Invalid Credentials')
    }

    const isPasswordCorrect = await user.comparePassword(password)
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError('Invalid Credentials')
    }

    const tocken = user.createJWT()
    res.status(StatusCodes.OK).json({user: {name: user.name}, tocken})
}


module.exports = {
    register,
    login,
}