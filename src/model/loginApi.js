const mongoose = require('mongoose')

/*{ strict: false }*/

const loginSchema = new mongoose.Schema({

    device_name:{
        type: String
    },

    firebase_token: {
        type: String,
    },

}, {
    timestamps: true
})

//Now creating new collection
const loginUser = new mongoose.model('tempuser', loginSchema)
module.exports = loginUser;
