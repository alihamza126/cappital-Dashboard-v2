const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const referralCodeSchema = new Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    priceDiscount: {
        type: Number,
        required: true
    },
    expireDate: {
        type: Date,
        required:false
    }
});

const ReferralCode = mongoose.model('ReferralCode', referralCodeSchema);

module.exports = ReferralCode;
