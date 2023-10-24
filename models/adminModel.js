const mongoose = require('mongoose')

mongoose.connect("mongodb://0.0.0.0:27017/probank")
    .then(()=>{console.log("connection established")})
    .catch((e)=>console.log(e.message))

const adminSchema = new mongoose.Schema({
    adminName:{
        type:String,
        required:true,
        default:'hudyfa'
    },
    adminPassword:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model("admin",adminSchema)