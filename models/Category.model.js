const mongoose = require('mongoose');

// Define Category Schema
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  children: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }]
});

// Create Category Model
const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
