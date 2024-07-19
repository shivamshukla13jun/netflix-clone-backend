const mongoose = require("mongoose");
const Joi = require("joi");

const MovieSchema = mongoose.Schema({
    title: { type: String },
    desc: { type: String },
    poster: { type: Array },
    licensors: { type: Array },
    producers: { type: Array },
    soorce:String,
    status:String,
    premiered:String,
    aired:Date,
    imageurl:{type:String,trim:true},
    access:{type:String,enum:["Free","standard","premium"],trim:true,default:"premium"},
    lang:{type:String,enum:["English","Hindi"],trim:true,default:"NAN"},
    duration: { type: String },
    trailer: { type: String },
    video: { type: Array },
    year: { type: String },
    genre: [
       {type:mongoose.Types.ObjectId,ref:"Category"}
    ],
    type: { type: String },
    url: { type: String },
    rate: { type: Number },
    episodes: { type: Number },
    ref: {type:mongoose.Types.ObjectId,ref:"Movie"}
}, { timestamps: true });

// Define Joi schema for validating movie object
const movieJoiSchema = Joi.object({
    title: Joi.string().default("No Title"),
    desc: Joi.string().required(),
    Thumbnail: Joi.array().required(),
    duration: Joi.string(),
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
