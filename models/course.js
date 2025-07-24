const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const courseSchema = new Schema({
    cname: {
        type: String,
        enum: ['nums', 'mdcat', 'mdcat+nums'],
        required: true
    },
    cdesc: {
        type: String,
        required: true
    },
    cprice: {
        type: Number,
        required: true
    },
});

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;