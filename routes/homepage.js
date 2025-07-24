const mongoose = require('mongoose');
const wrapAsync = require('../utils/wrapAsync.js');
const Home = require('../models/home.js');
const router = require('express').Router();


router.post('/topbar',wrapAsync(async (req, res) => {
    const { tcontent } = req.body;
    try {
        // Find the document
        let find = await Home.findOne();
        if (find) {
            await Home.updateOne({}, { tcontent });
        } else {
            // If document not found, create a new one
            find = new Home({ tcontent });
            await find.save();
        }
        res.status(200).json({ message: 'Success' });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}));


router.get('/topbar',wrapAsync(async(req,res)=>{
    const data=await Home.findOne();
    res.status(200).send(data);
}));



module.exports = router;
