const mongoose = require("mongoose");
const express = require('express');
const cors = require('cors');
const { MONGOOSE_URL, PORT } = require("./utiles/config");
const UserRouter = require("./routes/UserRouter");

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api',UserRouter)

mongoose.connect(MONGOOSE_URL)
    .then(
      console.log('connecting to mongodb')
)
  .catch(e=>{
     console.log('connect error',e)
  })
app.listen(PORT, (req, res) => {
      console.log(`server is running http://localhost:${PORT}`)
  })