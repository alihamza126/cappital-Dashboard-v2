const router = require('express').Router();
const userModel = require('../models/user');
const wrapAsync = require('../utils/wrapAsync');
const { isLoggedIn, checkTrialStatus } = require('../utils/middleware')


router.get('/', wrapAsync(async (req, res) => {
    try {
        const user = await userModel.find({});
        res.send(user)
    } catch (error) {
        console.log(error)
    }
}));

router.post('/update', wrapAsync(async (req, res) => {
    try {
        const userData = req.body;
        if (userData) {
            const user = await userModel.findByIdAndUpdate(userData.id, userData, { new: true });
            // Update the user session with the updated user data
            req.login(user, (err) => {
                if (err) {
                    res.status(500).send("Error updating user session");
                } else {
                    res.status(200).json({ user });
                }
            });
        } else {
            res.status(400).send("Invalid user data");
        }
    } catch (error) {
        res.send(error)
    }
}));

router.delete('/', wrapAsync(async (req, res) => {
    try {
        const userIds = req.body.userIds;
        const result = await userModel.deleteMany({ _id: { $in: userIds } });
        if (result.acknowledged) {
            res.json(result);
        } else {
            res.json({});
        }
    } catch (error) {
        console.log(error)
    }
}));


const activateTrial = async (userId) => {
    try {
        const trialDuration = 3; // 3 days trial period
        const trialExpiryDate = new Date();
        trialExpiryDate.setDate(trialExpiryDate.getDate() + trialDuration);

        await userModel.findByIdAndUpdate(userId, {
            isTrialActive: true,
            trialExpires: trialExpiryDate
        });

        return { success: true, message: 'Trial activated successfully' };
    } catch (error) {
        console.error('Error activating trial:', error);
        return { success: false, message: 'Error activating trial', error };
    }
};

router.post('/free-trial', isLoggedIn,checkTrialStatus, async (req, res) => {
    try {
        const userId = req.user._id;
        const isTrialActive = req.user.isTrialActive;

        if (isTrialActive) {
            return res.status(200).json({ message: "Trial already activated" });
        }

        const result = await activateTrial(userId);

        if (result.success) {
            return res.status(200).json(result); // Send success response
        } else {
            return res.status(500).json(result); // Send error response
        }

    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
