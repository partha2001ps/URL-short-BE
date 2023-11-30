const express = require('express');
const UserRouter = express.Router();
const UserContorller = require('../controllers/user');

UserRouter.post('/singup', UserContorller.singup);
UserRouter.post('/singin', UserContorller.singIn);
UserRouter.post('/reset-password', UserContorller.resetPassword);
UserRouter.post('/reset-password/:OTP',UserContorller.newpassword)

module.exports = UserRouter;