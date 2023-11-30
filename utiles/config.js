require("dotenv").config();

const MONGOOSE_URL = process.env.MONGOOSE_URL;
const PORT = process.env.PORT;
const JWT_PASS = process.env.JWT_PASS
const EMAIL_PASS=process.env.EMAIL_PASS

module.exports = {
    MONGOOSE_URL,
    PORT,
    JWT_PASS,
    EMAIL_PASS
}