const express = require('express');
const UserRouter = express.Router();
const UserContorller = require('../controllers/user');
const auth = require('../middelware/auth');
const urlcontroller = require('../controllers/short_url');

UserRouter.post('/singup', UserContorller.singup);
UserRouter.post('/singin', UserContorller.singIn);
UserRouter.post('/reset-password', UserContorller.resetPassword);
UserRouter.post('/reset-password/:OTP', UserContorller.newpassword);

UserRouter.get('/', auth.auth_middleWare, urlcontroller.geturl)
UserRouter.post('/', auth.auth_middleWare, urlcontroller.url_long)
UserRouter.get('/:shortId', urlcontroller.redirect_short);
UserRouter.delete('/:shortId', auth.auth_middleWare, urlcontroller.delete_url);

module.exports = UserRouter;