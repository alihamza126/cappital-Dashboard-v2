const router = require('express').Router();
const ReferralCode = require('../models/referral');
const wrapAsync = require('../utils/wrapAsync');
const Purchase = require('../models/purchase')

// // GET all referral codes
router.get('/', wrapAsync(async (req, res) => {
    try {
        const referralCodes = await ReferralCode.find();

        // Extract unique referral codes
        const codeNames = [...new Set(referralCodes.map(referral => referral.code))];

        // Count purchases for each referral code
        const purchaseCounts = await Purchase.aggregate([
            {
                $match: {
                    refCode: { $in: codeNames }
                }
            },
            {
                $group: {
                    _id: "$refCode",
                    count: { $sum: 1 }
                }
            }
        ]);

        // Create a mapping from referral code to purchase count
        const purchaseCountMap = purchaseCounts.reduce((acc, { _id, count }) => {
            acc[_id] = count;
            return acc;
        }, {});
        // Include the purchase count in the referral codes response
        const referralCodesWithCounts = referralCodes.map(referral => ({
            ...referral._doc,
            purchaseCount: purchaseCountMap[referral.code] || 0
        }));

        res.json(referralCodesWithCounts);
    } catch (err) {
        res.json({ message: err.message });
    }

}));



//get specfic referal
router.get('/:promo', wrapAsync(async (req, res) => {
    try {
        const promo = req.params.promo;
        const referralCodes = await ReferralCode.findOne({ code: promo });

        if (!referralCodes) {
            return res.status(200).json({ status: "Redeem Code Not Found", statusCode: 404 })
        }

        if (new Date() > referralCodes.expireDate) {
            return res.status(200).json({ status: "Redeem Code Expire", statusCode: 401 });
        }

        return res.status(200).send(referralCodes)
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}));


// Create a new referral code
router.post('/', wrapAsync(async (req, res) => {
    const { code, priceDiscount, expireDate } = req.body;
    const referralCode = new ReferralCode({
        code,
        priceDiscount,
        expireDate
    });
    try {
        const savedReferralCode = await referralCode.save();
        res.status(200).json(savedReferralCode);
    } catch (err) {
        res.json("something went wrong");
    }
}));

//DELETE REF CODE
router.delete('/:id', wrapAsync(async (req, res) => {
    try {
        const removedRefCode = await ReferralCode.findByIdAndDelete({ _id: req.params.id });
        res.status(200).json(removedRefCode);
    } catch (err) {
        res.json({ message: err });
    }


}));

module.exports = router;



