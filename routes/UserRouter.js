const express = require('express');
const UserRouter = express.Router();
const UserContorller = require('../controllers/user');
const auth = require('../middelware/auth');
const urlcontroller = require('../controllers/short_url');

UserRouter.post('/singup', UserContorller.singup);
UserRouter.post('/singin', UserContorller.singIn);
UserRouter.post('/reset-password', UserContorller.resetPassword);
UserRouter.post('/reset-password/:OTP', UserContorller.newpassword);

UserRouter.post('/', auth.auth_middleWare, urlcontroller.url_long)
UserRouter.get('/:shortId', auth.auth_middleWare, urlcontroller.redirect_short);

module.exports = UserRouter;