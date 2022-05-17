const mongoose = require('mongoose')
const menuList = new mongoose.Schema({

    menu_item: {
        type: String
    },

    item_contains: {
        type: String
    }
})

//Now creating new collection
const menuItems = new mongoose.model('menuitems', menuList)
module.exports = menuItems;
