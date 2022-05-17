const mongoose = require('mongoose')
const banners = new mongoose.Schema({


    banner_url: {
        type: String,
        required: true
    }
})

//Now creating new collection
const addbanners = new mongoose.model('banners', banners)
module.exports = addbanners;