const { default: mongoose } = require("mongoose");

const urlSchema = new mongoose.Schema({
    shortUrl: { type: String, required: true, unique: true },
    longUrl: { type: String, required: true },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    totalClicks: { type: Number, default: 0 }  
});

const URL_Model = mongoose.model('url', urlSchema);

module.exports = URL_Model;
