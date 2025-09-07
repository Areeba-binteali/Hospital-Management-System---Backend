const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI
// Connecting mongoose
mongoose.connect(MONGODB_URI)
    .then(() => { console.log('Connected!'); })
    .catch(err => console.log(err))