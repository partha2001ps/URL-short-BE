const { default: mongoose } = require("mongoose");
const URL_Model = require("../models/urlShort");

const urlcontroller = {
    url_long: async(req, res) => {
        try {
            const userId=req.userId
            const originalURL = req.body;
            const user = await URL_Model.findOne(userId)
            res.json(user)
        const exitUrl = await URL_Model.findOne({ longUrl: originalURL })  
        if (!exitUrl) {
            return res.status(400).json({message:"Already exiting ..."})
        }
        const uri = new URL_Model({
            longUrl:originalURL
        })
        await uri.save()
        }
        catch (e) {
            console.log("error",e)
        }
    }
}
module.exports= urlcontroller