const mongoose = require('mongoose')
const schema = mongoose.Schema;
const passportMongoose = require('passport-local-mongoose');

const userSchema = new schema({
    fullname: {
        type: String,
        default: '',
        required: false,
    },
    fathername: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    city: {
        type: String,
        required: false,
    },
    contact: {
        type: String,
        required: false,
    },

    solved_mcqs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MCQ' }],
    wrong_mcqs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MCQ' }],
    bookmarked_mcqs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MCQ' }],

    isMdcat: {
        type: Boolean,
        default: false,
        required: false,
    },
    isNums: {
        type: Boolean,
        default: false,
        required: false,
    },
    isMdcatNums: {
        type: Boolean,
        default: false,
        required: false,
    },
    profileUrl: {
        type: String,
        required: false,
        default: null
    },
    city: { //city
        type: String,
        required: false,
        default: '',
    },
    aggPercentage: {
        type: Number,
        required: false,
    },
    // New fields for free trial
    isTrialActive: {
        type: Boolean,
        default: false,
        required: false,
    },
    trialExpires: {
        type: Date,
        required: false,
        default: null,
    },

    resetPasswordExpires: Date,
    resetPasswordToken: String,
}, { timestamps: true });


userSchema.plugin(passportMongoose)
const userModel = mongoose.model('user', userSchema);

module.exports = userModel;

