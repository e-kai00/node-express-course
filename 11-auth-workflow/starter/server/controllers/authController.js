const User = require('../models/User');
const Token = require('../models/Token');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { attachCookiesToResponse, createTokenUser, sendVerificationEmail } = require('../utils');
const { use } = require('express/lib/router');
const crypto = require('crypto');


// --------------------------------------------------Register
const register = async (req, res) => {
  const { email, name, password } = req.body;

  const emailAlreadyExists = await User.findOne({ email });
  if (emailAlreadyExists) {
    throw new CustomError.BadRequestError('Email already exists');
  }

  // first registered user is an admin
  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? 'admin' : 'user';

  const verificationToken = crypto.randomBytes(40).toString('hex');
  const user = await User.create({ name, email, password, role, verificationToken });

  const origin = 'http://localhost:3000'
  // const newOrigin = 'https://react-node-user-workflow-front-end.netlify.app';

  // const tempOrigin = req.get('origin');
  // const protocol = req.protocol;
  // const host = req.get('host');
  // const forwardedHost = req.get('x-forwarded-host');
  // const forwardedProtocol = req.get('x-forwarded-proto');

  await sendVerificationEmail({
    name: user.name,
    email: user.email,
    verificationToken: user.verificationToken,
    origin
  });

  // send verification tocken back only while testing in Postman
  res.status(StatusCodes.CREATED)
    .json({
      msg: 'Success! Please check your email to varify it.', 
    })
};

// --------------------------------------------------Verify Email
const verifyEmail = async (req, res) => {
  const {verificationToken, email} = req.body;

  const user = await User.findOne({email})
  if (!user ) {
    throw new CustomError.UnauthenticatedError(`User does not exist.`);
  };

  if (verificationToken !== user.verificationToken) {
    throw new CustomError.UnauthenticatedError(`Wrong token.`);
  };

  user.isVerified = true;
  user.verified = Date.now();
  user.verificationToken = '';

  await user.save();
  res.status(StatusCodes.OK).json({msg: 'email verified'});
};

// --------------------------------------------------Login
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomError.BadRequestError('Please provide email and password');
  }
  const user = await User.findOne({ email });

  if (!user) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials');
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials');
  }

  if (!user.isVerified) {
    throw new CustomError.UnauthenticatedError('Please verify your account.');
  }

  const tokenUser = createTokenUser(user);

  // create refresh token
  let refreshToken = '';

  // check for existing token

  refreshToken = crypto.randomBytes(40).toString('hex');
  const userAgent = req.headers['user-agent'];
  const ip = req.ip; 
  const userToken = {refreshToken, userAgent, ip, user: user._id};
  await Token.create(userToken);

  attachCookiesToResponse({ res, user: tokenUser, refreshToken });

  res.status(StatusCodes.OK).json({ user: tokenUser });
};

// --------------------------------------------------Logout
const logout = async (req, res) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now() + 1000),
  });
  res.status(StatusCodes.OK).json({ msg: 'user logged out!' });
};

module.exports = {
  register,
  login,
  logout,
  verifyEmail
};
