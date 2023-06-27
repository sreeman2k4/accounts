const mongoose=require("mongoose");

const tripSchema=new mongoose.Schema({
    date:{
        type:String,
        required:true,
    },
    vehicle:{
        type:String,
        required:true,
    },
    paymenttype:{
        type:String,
    },
    reason:{
        type:String,
    },
    amount:{
        type:Number,
    },
    vchtype:{
        type:String,
    },
    vchno:{
        type:Number,
    },
    debit:{
        type:Number,
    },
    credit:{
        type:Number,
    }
})


module.exports=mongoose.model("Trip",tripSchema)