const User = require('../models/User')
const {StatusCodes} = require('http-status-codes')


const register = async (req, res) => {
    // create user
    const user = await User.create({...req.body})
    const tocken = user.createJWT()

    res.status(StatusCodes.CREATED).json({user: {name: user.name}, tocken})
}

const login = async (req, res) => {
    res.send('login user')
}

module.exports = {
    register,
    login,
}