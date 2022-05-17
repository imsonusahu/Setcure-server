const mongoose = require('mongoose')
const cityState = new mongoose.Schema({

    city: {
        type: String
    },

    state: {
        type: String
    }
})

//Now creating new collection
const myCityState = new mongoose.model('region', cityState)
module.exports = myCityState;