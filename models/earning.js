const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const earningsSchema = new Schema({
    course: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
});

const Earnings = mongoose.model('Earnings', earningsSchema);

module.exports = Earnings;
