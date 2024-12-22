const mongoose = require("mongoose");

const connectDB = async()=>{
    try{
        await mongoose.connect('mongodb+srv://shreerajmane007:passwordworkso@cluster0.luoyd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
        console.log('Database connected successfully')
    }
    catch(err){
        console.log(err, "error in connecting database")
    }
}

module.exports = connectDB;