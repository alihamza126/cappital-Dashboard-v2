const userModel = require("../models/user");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/login')
    }
    next();
}


module.exports.isBuyCourse = async (req, res, next) => {
    if (req.isAuthenticated()) {
        const user = userModel.findById(req.user._id);
        const course = req.body.course?.trim();
        if (course === 'mdcat') {
            (!user.isMdcat) && res.status(401).json({});
        }
        if (course === 'nums') {
            (!user.isNums) && res.status(401).json({});
        }
    }
    next();
}



module.exports.checkTrialStatus = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const user = await userModel.findById(userId);

        if (user) {
            const currentDate = new Date();
            if (user?.isTrialActive && user?.trialExpires < currentDate) {
                await userModel.findByIdAndUpdate(userId, { isTrialActive: false });
                req.user.isTrialActive = false;
            }
        }
        next();
    } catch (error) {
        next();
    }
};