const User = require("../models/user");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { default: mongoose } = require("mongoose");
const { JWT_PASS, EMAIL_PASS } = require("../utiles/config");
const nodemailer=require('nodemailer');
const { auth_middleWare } = require("../middelware/auth");


const UserContorller = {
    singup: async (req, res) => {
        try {
            const { firstname, lastname, email, password } = req.body;
            const existingUser = await User.findOne({ email });

            if (existingUser) {
                return res.json({ message: "This email is already in use. Please use another email or log in." });
            }

            const passwordHash = await bcrypt.hash(password, 10);
            const activationToken = Math.random().toString(36).slice(-10);

            const user = new User({
                firstname,
                lastname,
                email,
                passwordHash,
                activationToken,
                activated: false, 
            });

            await user.save();

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'parthapn2017@gmail.com',
                    pass: EMAIL_PASS,
                },
            });

            const activationLink = ` http://localhost:5173/activate-account/${activationToken}`;
            const mailOptions = {
                from: 'noreply@example.com',
                to: email,
                subject: 'Activate Your Account',
                text: `Welcome to the site! Please click the following link to activate your account: ${activationLink}`,
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                    return res.json({ message: 'Error sending activation email' });
                } else {
                    return res.json({ message: 'Activation email sent successfully' });
                }
            });
        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    },
    singIn: async (req, res)=>{
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email })
            if (!user) {
                return res.status(400).json({meaasge:"Invaild User"})
            }
            const passwordMatch = await bcrypt.compare(password, user.passwordHash);
            if (!passwordMatch) {
                return res.status(403).json({message:"Invaild Password"})
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
            return res.json({meaasge:"Invaild User"})
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
          const Link=`https://main--lively-crumble-bcfe7b.netlify.app/reset-password/new-password/${OTP}`
          const mailOptions = {
            from: 'Password_resest_noreply@gmail.com',
            to: email,
            subject: 'Reset Your Password',
            text: `you are receiving this email because you request has passwords reset for your account .\n\n please use the following Link  to  Click reset your password:${Link} \n\n if you did not request a password to ignore this email. `,
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
            return res.json({ message: "please enter the new password" });
        }
        const user = await User.findOne({ reset_OTP: OTP })
        if (!user) {
            return res.json({ message: "Invalid OTP" });
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
    activateAccount: async (req, res) => {
        try {
            const { activationToken } = req.params;
            const user = await User.findOne({ activationToken, activated: false });

            if (user) {
                user.activated = true;
                user.activationToken = null; // Optional: Clear activation token after activation
                await user.save();

                return res.json({ message: 'Account activated successfully' });
            } else {
                return res.json({ message: 'Invalid activation token or account already activated' });
            }
        } catch (error) {
            console.error("Error activating account:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
};
module.exports = UserContorller;