const mongoose = require("mongoose");
const shortid = require("shortid"); 
const URL_Model = require("../models/urlShort");
const User = require("../models/user");
const urlcontroller = {
    url_long: async (req, res) => {
      try {
        const { longUrl } = req.body;
        const userId = req.userId;
        const user = await User.findById(userId);
        if (user) {
          const shortId = shortid()
          const data = new URL_Model({
            shortUrl: shortId,
            longUrl,
            user:userId
          })
          // console.log(longUrl)
          await data.save()
          return res.status(200).json({id:shortId})
        }
        return res.json({ message: "User not found" });
      } catch (e) {
        console.log("error", e);
        return res.status(500).json({ message: "Internal Server Error" });
      }
    },
  
    redirect_short: async (req, res) => {
      try {
        const {shortId} = req.params;
        const data = await URL_Model.findOne({ shortUrl: shortId });
        
        if (data) {
          return res.redirect(data.longUrl);
        } else {
          return res.status(404).json({ message: "Short URL not found" });
        }
      } catch (e) {
        console.error("error", e);
        return res.status(500).json({ message: "Internal Server Error" });
      }
    },
    
    
  };
  
  module.exports = urlcontroller;
  