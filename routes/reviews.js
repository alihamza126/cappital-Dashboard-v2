const mongoose=require('mongoose');
const {Review}=require('../models/reviews.js');
const wrapAsync = require('../utils/wrapAsync.js');
const router=require('express').Router();



// post router review
router.post('/new',wrapAsync(async(req,res)=>{
    const review=new Review({
        name:req.body.name,
        comment:req.body.comment,
        city:req.body.city
    });
    await review.save();
    res.send("review");
}));

// get router review
router.get('/',wrapAsync(async(req,res)=>{
    const reviews=await Review.find();
    res.send(reviews);
}));

//edit reviews
router.put('/:id',wrapAsync(async(req,res)=>{
    const review=await Review.findByIdAndUpdate(req.params.id,{
        name:req.body.name,
        comment:req.body.comment,
        city:req.body.city
    },{new:true});
    if(!review) return res.status(404).send('The review with the given ID was not found');
    res.send(review);
}));

// delete reviews
router.delete('/:id',wrapAsync(async(req,res)=>{
    const review=await Review.findByIdAndDelete(req.params.id);
    if(!review) return res.status(404).send('The review with the given ID was not found');
    res.send(review);
}));


module.exports=router;