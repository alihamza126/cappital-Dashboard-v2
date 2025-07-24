const router = require('express').Router();
const Admin = require('../models/admin');
const wrapAsync = require('../utils/wrapAsync');

router.post('/',wrapAsync(async (req, res) => {
    const adminData = {
        password: req.body.password
    };
    try {
        const updatedAdmin = await Admin.findOneAndUpdate(
            {}, // Search criteria (empty object means it will look for any document)
            adminData, // The data to update
            { new: true, upsert: true } // Options: create a new doc if none is found, return the updated doc
        );
        res.json(updatedAdmin);
    } catch (err) {
        res.json({ message: err });
    }
}));

router.get('/',wrapAsync(async (req, res) => {
    try {
        const admin = await Admin.findOne();
        res.json(admin);
    } catch (err) {
        res.json({ message: err });
    }
}));



module.exports = router;