const mongoose = require('mongoose');

// file schema
const constituencySchema = mongoose.Schema({   // Json layout of a metaconstituency // metaconstituency scheme for for data base
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  }
});

const Constituency = module.exports = mongoose.model('Constituency', constituencySchema);
