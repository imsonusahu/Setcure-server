const mongoose = require('mongoose')
const products = new mongoose.Schema({

    item_name: {
        type: String
    },

    item_url: {
        type: String
    },
    item_type:{
        type:String
    },

    service_charge:{
        type:String

    },
    active_status:{
        type:Boolean
    }
})

//Now creating new collection
const productlist = new mongoose.model('products', products)
module.exports = productlist;
