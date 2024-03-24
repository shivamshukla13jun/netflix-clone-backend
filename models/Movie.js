const mongoose = require("mongoose");
const Joi = require("joi");

const MovieSchema = mongoose.Schema({
    title: { type: String, default: "No Title" },
    desc: { type: String },
    img: { type: Array },
    runtime: { type: Number },
    trailer: { type: Array },
    video: { type: Array },
    year: { type: String },
    genre: { type: Array },
    type: { type: String },
    url: { type: String },
    rate: { type: Number },
    episodes: { type: Number },
}, { timestamps: true });

// Define Joi schema for validating movie object
const movieJoiSchema = Joi.object({
    title: Joi.string().default("No Title"),
    desc: Joi.string().required(),
    img: Joi.array().required(),
    runtime: Joi.number(),
    trailer: Joi.array(),
    video: Joi.array(),
    year: Joi.string(),
    genre: Joi.array(),
    type: Joi.string(),
    url: Joi.string(),
    rate: Joi.number(),
    episodes: Joi.number()
});

// Create a method to validate a movie object using Joi schema
MovieSchema.statics.joiValidate = function (obj) {
    return movieJoiSchema.validate(obj);
};

const Movie = mongoose.model("Movie", MovieSchema);

module.exports = Movie;
