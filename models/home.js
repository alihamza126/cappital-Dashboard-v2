const mongoose = require('mongoose');

const homeSchema = new mongoose.Schema({
  tcontent: {
    type: String,
    default: "Welcome Dear Student! May Your Journey Be Filled With Joy & Success"
  },
  createdAt: { type: Date, default: Date.now },
});

const Home = mongoose.model('Common', homeSchema);

module.exports = Home;

