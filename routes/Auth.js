const router = require('express').Router();
const passport = require('passport');
const userModel = require('../models/user');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const wrapAsync = require('../utils/wrapAsync');


//register
router.post('/register', wrapAsync(async (req, res) => {
    try {
        const { username, fathername, email, contact, city, password, } = req.body;
        const user = new userModel({ username, fathername, email, contact, city });
        const registeredUser = await userModel.register(user, password);
        res.status(200).json({ message: "Your account has been created successfully!" });
    } catch (error) {
        res.status(409).json({ message: "User & email already exists" });
    }
}));

//login request
router.post('/login', passport.authenticate('local', { failureMessage: "something went wrong!" }), (req, res) => {
    const { solved_mcqs, wrong_mcqs, bookmarked_mcqs,salt,hash, ...userWithoutMCQs } = req.user.toObject();
    res.status(200).json({ user: userWithoutMCQs });
  });
  
//logout
router.get('/logout', (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            return next(err);
        }
        res.status(200).json('you are logged out successfully')
    })
});

//verify email to reset password
router.post('/forgot-password',wrapAsync(async (req, res, next) => {
    const { email } = req.body;
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const token = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour
        await user.save();
        // Construct the reset password link
        const resetPasswordLink = `${req.protocol}://${req.get('host')}/forgot-password/${token}`;
        // const resetPasswordLink = `${req.protocol}://localhost:5173/forgot-password/${token}`;
        await sendResetPasswordEmail(email, resetPasswordLink);
        res.status(200).json({ message: "Reset password link sent successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}));

//resetmail check
router.get('/forgot-password/:token',wrapAsync(async (req, res) => {
    try {
        const token = req.params.token;

        // Find the user with the provided reset token
        const user = await userModel.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() } // Check if the token is not expired
        });
        if (!user) {
            // Handle invalid or expired token
            return res.status(400).send('Invalid or expired reset password token.');
        }
        // Render the reset password form
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
}));

//reset password
router.put('/forgot-password/:token',wrapAsync(async (req, res, next) => {
    try {
        const token = req.params.token;
        const newpass = req.body.password;
        if (newpass) {
            const user = await userModel.findOne({
                resetPasswordToken: token,
                resetPasswordExpires: { $gt: Date.now() } // Check if the token is not expired
            });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            user.setPassword(newpass, (err, u) => {
                if (err) {
                    return res.status(500).json({ message: "Failed to reset password" });
                }
                u.save().then((result) => {
                    return res.status(200).json({ message: "Password reset successfully" });
                });
            });
        } else {
            return res.status(400).json({ message: "Password not set, try again" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    };

}));

// Function to send the reset password email
async function sendResetPasswordEmail(email, resetPasswordLink) {
    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'thecapitalacademy.online@gmail.com', // Your email address
            pass: 'ewbh lcnn jzsg bors' // Your email password
        }
    });

    // Email content
    const mailOptions = {
        from: 'thecapitalacademy.online@gmail.com', // Sender email address
        to: email, // Receiver email address
        subject: 'Password Reset', // Subject line
        text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n`
            + `Please click on the following link, or paste this into your browser to complete the process:\n\n`
            + `${resetPasswordLink}\n\n`
            + `If you did not request this, please ignore this email and your password will remain unchanged.\n`
            + `This Link expire in 1 Hour.\n`
    };

    // Send the email
    await transporter.sendMail(mailOptions);
}




module.exports = router;