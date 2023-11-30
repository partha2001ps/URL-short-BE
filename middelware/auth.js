const jwt = require('jsonwebtoken');
const { JWT_PASS } = require('../utiles/config');

const auth = {
    auth_middleWare: async (req, res, next) => {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(400).json({message:"Token not vaild"})
        }
        const getToken = (request) => {
            const authorization = request.get('authorization');
            if (authorization && authorization.toLowerCase().startWith('bearer ')) {
                return authorization.subString(7)
            }
            return null;
        }
        try {
            jwt.verify(getToken, JWT_PASS, (error, decodeToken) => {
                if (error) {
                   return res.status(400).json({message:"Invaild Token"})
                }
                req.userId = decodeToken.id;
                next();
           }) 
        }
        catch (e) {
            console.log(e)
        }
    }
}

module.exports=auth