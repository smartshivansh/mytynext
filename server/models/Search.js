const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const searchSchema = new Schema(
  {
    query: {
      type: String,
    },
  },

  { timestamps: true }
);

module.exports = Search = mongoose.model('Search', searchSchema);
