const mongoose = require('mongoose')
const ourServicesSchema = new mongoose.Schema({

    service_name:{
        type: String,
        required: true,
        minlength: 3,
        unique: [true,"Service already exist"],

    },

    city_name: {

        type: String,
        required: true,

    },

    active_status: {
        type: Boolean,
        required: true
    },

    icon: {
        type: String,
        required: true
    },
    button_color: {
        type: String,
        required: true
    }
})

//Now creating new collection
const addOurServices = new mongoose.model('ourServices', ourServicesSchema)
module.exports = addOurServices;