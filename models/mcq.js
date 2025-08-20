const mongoose = require('mongoose');

const mcqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  options: {
    type: [String],
    required: true
  },
  correctOption: {
    type: Number,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'], // Only allow values 'easy', 'medium', or 'hard'
    required: true
  },
  subject: {
    type: String,
    enum: ['english', 'chemistry', 'physics', 'logic', 'biology', 'others'],
    required: true
  },
  chapter: {
    type: String,
    required: true,
  },

  // ----------------------------------------------------------------
  category: {
    type: String,//need to change into text format
    enum: ['past', 'normal'], // Only allow values 'past' or 'normal'
    required: true
  },
  topic: {
    type: String,
    default: "",
  },
  course: {
    type: String,
    enum: ['mdcat', 'nums'], // Only allow values 'past' or 'normal'
    required: true,
  },
  info: {
    type: String,
    default: ""
  },
  explain: {
    type: String,
    default: "Explanation Not provided"
  },
  imageUrl: { type: String, default: '' },
  questionImg: { type: String, default: '' },
  isSeries: {
    type: Boolean,
    default: false
  },
  seriesId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Series',
    required: function () {
      return this.isSeries === true;
    }
  }
});

const MCQ = mongoose.model('MCQ', mcqSchema);
module.exports = MCQ;