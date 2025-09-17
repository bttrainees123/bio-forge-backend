const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
  name: { type: String,  unique: true },
  templateBody: { type: String, }, // HTML code for the template
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = templateSchema;