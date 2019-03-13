electionconst mongoose = require('mongoose');

// file schema
const electionSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  electiontype: {
    type: String,
    required: true
  },
  : {
    electioninfo: String,
    required: true
  }
});

const Election = module.exports = mongoose.model('Election', electionSchema);
