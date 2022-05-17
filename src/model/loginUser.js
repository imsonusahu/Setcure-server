const mongoose = require('mongoose')

/*{ strict: false }*/

const loginSchema = new mongoose.Schema({

    name:{
        type: String
    },

    activeStatus: {
        type: Boolean,
    },
    profile: {
        type: String,
    },
    mobile: {
        type: String,
  },
    device_info: {
        type: String,
    },
    firebase_token: {
        type: String,
    },
      otp: {
        type: String,
    },
    email: {
        type: String
    },

    verified: {
        type: Boolean,
    },
    status: {
        type: Number,
    },
    userSettings: [{
        type: {
            type: String
        },
        isEnabled: {
            type: Boolean
        }
    }] //$push $set

}, {
    timestamps: true
})

//Now creating new collection
const loginUser = new mongoose.model('allusers', loginSchema)
module.exports = loginUser;
