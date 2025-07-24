const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const purchaseSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    course: {
        type: String,
        enum: ['nums', 'mdcat', 'mdcat+nums'],
        default: null,
        required: false,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    price: {
        type: Number,
        required: true
    },
    purchaseDate: {
        type: Date,
        required: new Date()
    },
    paymentScreenshot: {
        type: String,
        required: true
    },
    refCode:{
    	 type: String,
    	 required:false,
    },
    isCheck: {
        type: Boolean,
        default: false
    },
    expiryDate: {
        type: Date,
        default: function () {
            const currentDate = new Date();
            currentDate.setDate(currentDate.getDate() + 90);
            return currentDate;
        }
    }
});


// Middleware to update expiry date when status is changed to rejected
purchaseSchema.pre('save', function (next) {
    if (this.isModified('status')) {
        if (this.status === 'rejected') {
            this.expiryDate = new Date(); // Set expiryDate to the current date
        } else if (this.status === 'approved') {
            const expiryMonths = 3; // Number of months the course remains valid after approval
            const currentDate = new Date();
            currentDate.setMonth(currentDate.getMonth() + expiryMonths);
            this.expiryDate = currentDate;
        }
    }
    next();
});

// Method to increase the expiry date by a specified number of days
purchaseSchema.methods.extendExpiryDate = function (days) {
    if (days <= 0) {
        throw new Error('Number of days must be positive');
    }
    const newExpiryDate = new Date(this.expiryDate || this.purchaseDate); // If expiryDate is not set, use purchaseDate
    newExpiryDate.setDate(newExpiryDate.getDate() + days);
    this.expiryDate = newExpiryDate;
    return this.save();
};

const Purchase = mongoose.model('purchase', purchaseSchema);
module.exports = Purchase;
