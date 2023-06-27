const mongoose=require("mongoose");

const workerSchema=new mongoose.Schema({

    name:{
        type:String,
        required:true,
        unique:true,
    },
    totdebit:{
        type:Number,
    },
    totcredit:{
        type:Number,
    },
    balance:{
        type:Number,
    },
    trips:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Trip",
        }
    ]
})

module.exports=mongoose.model("Worker",workerSchema)