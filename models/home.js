const mongoose = require('mongoose');

const homeSchema = new mongoose.Schema({
  tcontent: {
    type: String,
    default:"Welcome Dear Student! May Your Journey Be Filled With Joy & Success"
  },
});

const Home = mongoose.model('Home',homeSchema);

module.exports =Home;