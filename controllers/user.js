const User = require("../models/user");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { default: mongoose } = require("mongoose");
const { JWT_PASS, EMAIL_PASS } = require("../utiles/config");
const nodemailer=require('nodemailer');
const { auth_middleWare } = require("../middelware/auth");


const UserContorller = {
    singup: async(req, res) => {
        try {
            const { name, email, password } = req.body
            const exitinguser =await User.findOne({ email })
            if (exitinguser) {
                return res.status(400).json({message:"This is Email Already Exiting... To use Another email or LogIn"})
            }
          const passwordHash = await bcrypt.hash(password, 10)
            const user = new User({
                name:name,
                email: email,
                passwordHash
            })
            await user.save()
            return res.status(200).json({message:"user created successfull"})
        }
        catch (e) {
            console.log(e)
        }
    },
    singIn: async (req, res)=>{
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email })
            if (!user) {
                return res.ststus(400).json({meaasge:"Invaild User"})
            }
            const passwordMatch = await bcrypt.compare(password, user.passwordHash);
            if (!passwordMatch) {
                return res.status(400).json({message:"Invaild Password"})
            }
            const token = jwt.sign({
                email: email,
                id:user._id
            },JWT_PASS)
            res.json({ token, email: email })
        }
        catch (error) {
            console.log(error)
        }
    },
    resetPassword: async(req, res) =>{
        const { email } = req.body;
        const user = await User.findOne({ email })
        if (!user) {
            return res.ststus(400).json({meaasge:"Invaild User"})
        }
        const OTP = Math.random().toString(36).slice(-6);
        user.reset_OTP = OTP
        await user.save()
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'parthapn2017@gmail.com',
              pass: EMAIL_PASS,
            },
          });
        
          const mailOptions = {
            from: 'Password_resest_noreply@gmail.com',
            to: email,
            subject: 'Reset Your Password',
            text: `you are receiving this email because you request has passwords reset for your account .\n\n please use the following  OTP to reset your password:${OTP} \n\n if you did not request a password to ignore this email. `,
          };
        
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log(error);
              return res.json({ message: 'Error sending reset email' });
            } else {
              return res.json({ message: 'Reset email sent successfully' });
            }
          });
    },
    newpassword: async (req, res) => {
        try {
            const { OTP } = req.params;
        const { password } = req.body;
        if (!password) {
            return res.status(400).json({ message: "please enter the new password" });
        }
        const user = await User.findOne({ reset_OTP: OTP })
        if (!user) {
            return res.status(400).json({ message: "Invalid OTP" });
        }
        const NewPass = await bcrypt.hash(password, 10);
        user.passwordHash = NewPass;
        user.reset_OTP = null;
           
        await user.save();

        res.json({meaasge:"password reset successfull"})
        }
        catch (e) {
            console.log(e)
        }
    },
    profile: async (request, responce) => {
        const userId = request.userId
        const user = await User.findById(userId)
        responce.json(user)
    }
}
module.exports = UserContorller;