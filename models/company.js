const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name:  String, 
  address: {
    province: { type: String}
  },
});

const company = mongoose.model('Company', schema);

module.exports = company;