const mongoose = require('mongoose');
const wrapAsync = require('../../utils/wrapAsync.js');
const multer = require('multer');
const screenshotStorage = require('../../utils/Storage.js');
const userModel = require('../../models/user.js');
const Purchase = require('../../models/purchase.js');
const Earnings = require('../../models/earning.js');
const { isLoggedIn } = require('../../utils/middleware.js');
const router = require('express').Router();
const { storage } = require('../../utils/cloudinary.js');


// const upload = multer({ storage: screenshotStorage });
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        try {
            if (file.mimetype === "image/jpg" || file.mimetype === "image/png" || file.mimetype === "image/jpeg") {
                cb(null, true);
            } else {
                cb(new Error('Select a valid image!'));
            }
        } catch (error) {
            console.log(error)
        }
    }
});

router.post('/upload-screenshot', isLoggedIn, upload.single('screenshot'), wrapAsync(async (req, res) => {
    let { finalPrice, course, userid,refCode } = req.body;
    const user = await userModel.findById(userid);
    if (user) {
        finalPrice = parseInt(finalPrice);
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded." });
        }
        const fileURL = req.file.path;
        const newPurchase = new Purchase({
            user: userid,
            course: course,
            price: finalPrice,
            refCode,
            purchaseDate: new Date(),
            paymentScreenshot: fileURL
        });
        await newPurchase.save();
        return res.json({ message: "File uploaded", fileURL });
    } else {
        res.status(400).json({ error: "User not found." });
    }
}));

// get purchase for user dashbaord
router.get('/dashboard', wrapAsync(async (req, res) => {
    try {
        const documents = await Purchase.find({ user: req.user._id });
        const extractedData = documents.map(doc => {
            const { course, status, price, purchaseDate, expiryDate } = doc;
            return {
                course,
                price,
                purchaseDate,
                status,
                expiryDate
            };
        });
        res.json(extractedData);
    } catch (error) {
        console.log(error)
    }
}));


//get all purchases for admin panel
router.get('/', wrapAsync(async (req, res, next) => {
    const documents = await Purchase.find({}).populate('user');

    const extractedData = documents.map(doc => {
        const { _id, course, status, price, purchaseDate, paymentScreenshot, expiryDate } = doc;
        const user = doc.user || {}; // Handle cases where user object might be null or missing
        const username = user.username || null;
        const profileUrl = user.profileUrl || null;

        return {
            id: _id,
            avatarUrl: profileUrl,
            name: username,
            course,
            price,
            date: purchaseDate,
            status,
            paymentImg: paymentScreenshot,
            expiryDate
        };
    });
    res.json(extractedData);

}));

//get single purchase referalll for admin panel
router.get('/:id/:days', wrapAsync(async (req, res, next) => {
    const { id, days } = req.params;
    await Purchase.findOne({ _id: id })
        .then(purchase => {
            const daysToExtend = parseInt(days); // Example: Extend by 90 days
            return purchase.extendExpiryDate(daysToExtend);
        })
        .then(updatedPurchase => {
        })
        .catch(error => {
        });
}));


//handle purchase status for admin panel
router.put('/:id', wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const { status } = req.body;
    const purchase = await Purchase.findById(id);
    if (purchase) {
        purchase.status = status;
        await purchase.save();

        try {
            if (purchase.status == 'approved') {
                // const newEarning = new Earnings({
                //     _id: purchase._id,
                //     course: purchase.course,
                //     price: purchase.price,
                // });
                // const edata = await newEarning.save();
                const edata = await Earnings.findOneAndUpdate(
                    { _id: purchase._id }, // Query to find the document
                    {
                        course: purchase.course,
                        price: purchase.price,
                    }, // Update data
                    {
                        new: true, // Return the updated document
                        upsert: true // Create a new document if none exists
                    }
                );

                //find course user and update course status
                const userdata = await userModel.findById(purchase.user);
                if (purchase.course == "mdcat") {
                    userdata.isMdcat = true;
                    await userdata.save();
                } else if (purchase.course == "nums") {
                    userdata.isNums = true;
                    await userdata.save();
                } else if (purchase.course == "mdcat+nums") {
                    userdata.isMdcatNums = true;
                    await userdata.save();
                }


            } else if (purchase.status == 'rejected' || purchase.status == 'pending') {
                const userdata = await userModel.findById(purchase.user);
                if (purchase.course == "mdcat") {
                    userdata.isMdcat = false;
                    await userdata.save();
                }
                else if (purchase.course == "nums") {
                    userdata.isNums = false;
                    await userdata.save();
                }
                else if (purchase.course == "mdcat+nums") {
                    userdata.isMdcatNums = false;
                    await userdata.save();
                }
            }
        } catch (error) { }

        res.json({ message: "Status updated." });
    } else {
        res.status(404).json({ error: "Purchase not found." });
    }
}));

//handle purchase status for admin [array type]
router.put('/select/:type', wrapAsync(async (req, res, next) => {
    const { type } = req.params;
    const { status } = req.body;
    const { collectionsId } = req.body;

    if (type == 'update') {
        try {
            const documentsToUpdate = await Purchase.find({ _id: { $in: collectionsId } });

            for (const document of documentsToUpdate) {
                document.status = status;
                await document.save(); // This will trigger the pre('save') hook

                if (status === 'approved') {
                    const newEarning = new Earnings({
                        course: document.course,
                        price: document.price,
                    });
                    await newEarning.save();
                    const userdata = await userModel.findById(document.user);

                    if (userdata) {
                        if (document.course === 'mdcat') {
                            userdata.isMdcat = true;
                        } else if (document.course === 'nums') {
                            userdata.isNums = true;
                        } else if (document.course === 'mdcat+nums') {
                            userdata.isMdcatNums = true;
                        }
                        await userdata.save();
                    }
                }
                else if (status === 'rejected' || status === 'pending') {
                    const userdata = await userModel.findById(document.user);
                    if (userdata) {
                        if (document.course === 'mdcat') {
                            userdata.isMdcat = false;
                        } else if (document.course === 'nums') {
                            userdata.isNums = false;
                        } else if (document.course === 'mdcat+nums') {
                            userdata.isMdcatNums = false;
                        }
                        await userdata.save();
                    }
                }
            }
            res.status(200).json({ message: `${documentsToUpdate.length} items updated successfully.` });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else if (type == 'delete') {
        const reponse = await Purchase.deleteMany({ _id: { $in: collectionsId } });
        res.status(200).json({ message: `${reponse.deletedCount} purchases deleted successfully.` });
    } else if (type == 'extendDate') {
        const days = req.body.days || 0;
        try {
            const documentsToUpdate = await Purchase.find({ _id: { $in: collectionsId } });
            const promises = documentsToUpdate.map(async (document) => {
                const daysToExtend = parseInt(days); // Example: Extend by 90 days
                return document.extendExpiryDate(daysToExtend);
            });
            // Wait for all updates to complete
            await Promise.all(promises);
            res.status(200).json({ message: `${documentsToUpdate.length} items updated successfully.` });
        } catch (error) {
            next(error);
        }
    }
    else {
        res.status(400).json({ error: "Invalid operation." });
    }
}));









module.exports = router;
