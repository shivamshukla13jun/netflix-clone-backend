const mongoose = require('mongoose');

// Define schema for hero carousel items
const HeroCarouselItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  desc: {
    type: String,
    required: true
  },
  buttonText: {
    type: String,
    required: true
  },
 
  image: {
    type: Array,
    required: true
  },
  // You can add more fields like a link, button text, etc. depending on your requirements
}, { timestamps: true });

// Define schema for hero carousel


// Create model for hero carousel
const HeroCarouselModel = mongoose.model('HeroCarouselModel', HeroCarouselItemSchema);

module.exports = HeroCarouselModel;
