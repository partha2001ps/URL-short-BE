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
          shortUrl: `https://url-short-8pbk.onrender.com/api${shortId}`,
          longUrl,
          user: userId
        })
        user.totalurls += 1;
        await user.save()
        // console.log(longUrl)
        await data.save()
        return res.status(200).json({ id: shortId })
      }
      return res.json({ message: "User not found" });
    } catch (e) {
      console.log("error", e);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
  
  redirect_short: async (req, res) => {
    try {
      const { shortId } = req.params;
      const data = await URL_Model.findOne({ shortUrl: shortId });
        
      if (data) {
        data.totalClicks += 1;
        await data.save();
        return res.redirect(data.longUrl);
      } else {
        return res.json({ message: "Short URL not found" });
      }
    } catch (e) {
      console.error("error", e);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
  delete_url: async (req, res) => {
    try {
      const userId = req.userId;
      const { shortId } = req.params;
    
      const url = await URL_Model.findOne({ shortUrl: shortId });
    
      if (url) {
        if (url.user.toString() === userId) {
          await URL_Model.findOneAndDelete({ shortUrl: shortId });
          await User.findByIdAndUpdate(userId, { $inc: { totalurls: -1 } });
          return res.json({ message: "Delete Done" });
        } else {
          return res.status(403).json({ message: "Unauthorized: You cannot delete this URL" });
        }
      } else {
        return res.status(404).json({ message: "Invalid ShortId" });
      }
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
  geturl: async (req, res) => {
    try {
      const userId = req.userId;
      const data = await URL_Model.find({ user: userId });

      if (data.length > 0) {
        return res.json(data);
      } else {
        return res.json({ message: "No URLs found for the user" });
      }
    } catch (error) {
      console.error("Error fetching URLs:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
  module.exports = urlcontroller;
  