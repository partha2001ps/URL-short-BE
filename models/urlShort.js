const { default: mongoose } = require("mongoose");

const urlSchema = new mongoose.Schema({
    longUrl: String,
    shortUrl:String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
})
const URL_Model = mongoose.model('URL', urlSchema)
 
module.exports = URL_Model;
