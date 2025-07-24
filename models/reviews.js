const mongoose=require('mongoose')
const Schema=mongoose.Schema;


const reviewSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    comment:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:false,
    },
},{
    timestamps:true
});

const Review=mongoose.model('Review',reviewSchema);
module.exports={Review};
