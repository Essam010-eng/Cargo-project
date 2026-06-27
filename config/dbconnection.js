const mongoose = require("mongoose");
require("dotenv");

const dbconection = async ()=>{
    try{
        await mongoose.connect(process.env.db_url)
            console.log("db connect successful")
    }
    catch(err){
        console.error("DB connection failed:", err); throw err;
    }
}

module.exports =dbconection;