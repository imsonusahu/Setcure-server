const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://imsonusahu:JBi-vYjZscxZC3h@cluster0.wf5ay.mongodb.net/CustomerApp?retryWrites=true&w=majority", {
}).then(()=>{

    console.log("Connection successful")
}).catch((err)=>{
    console.log(`${err}`)

});