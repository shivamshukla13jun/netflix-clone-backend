const { ObjectId} = require("mongoose");
const Movie = require("../models/Movie");
const API_KEY = "efdd474fc85772c8ecc497550ca8a0ac";
const imagePath = "https://image.tmdb.org/t/p/original";
const TrendingPage = `https://api.themoviedb.org/3/trending/all/week?api_key=${API_KEY}&language=en-US`;
module.exports = MoviesController = {
  Add: async (req, res, next) => {
    try {
      const payload = { ...req.body, ...req.files };
      if(typeof payload.genre==="string"){
        payload.genre=payload.genre.split(",")
      }
      console.log("genre",payload.genre)
      let { error, value } = Movie.joiValidate(payload);
      // Check for validation errors
      if (error) {
        error = new Error(error.details[0].message);
        error.statusCode = 400; // Set the status code
        throw error;
      }
      const newMovie = new Movie(payload);
      const savedMovie = await newMovie.save();
      console.log(savedMovie);
      res.status(200).json(savedMovie);
    } catch (error) {
      next(error);
    }
  },
  TotalCount: async (req, res, next) => {
    try {
      const count = await Movie.countDocuments();
      res.status(200).json({ total: count });
    } catch (error) {
      res.status(500).json(error);
      console.log(error);
    }
  },
  MultipleAdd: async (req, res, next) => {
    try {
      let saveddata = await Movie.insertMany(req.body);
      res.json(saveddata);
    } catch (error) {
      res.status(500).json(error);
      console.log(error);
    }
  },
  FindById: async (req, res, next) => {
    try {
      console.log({ id: req.params.id });
      const updatedMovie = await Movie.findById({ _id: req.params.id });
      console.log(updatedMovie);
      res.send(updatedMovie);
    } catch (error) {
      res.status(500).json(error);
      console.log(error);
    }
  },
  Update: async (req, res, next) => {
    if (req.user.isAdmin) {
      try {
        const { img, imgTitle, imgSm, trailer, video } = req.body;
        const updatedMovie = await Movie.findOneAndUpdate(
          { year },
          { $set: req.body },
          { new: true }
        );
        res.status(201).json(updatedMovie);
      } catch (error) {
        res.status(500).json(error);
        console.log(error);
      }
    } else {
      res.status(403).json("you are not allowed");
    }
  },
  UpdateById: async (req, res, next) => {
    if (req.user.isAdmin) {
      try {
        const updatedMovie = await Movie.findByIdAndUpdate(
          { _id: req.params.id },
          { $set: req.body },
          { new: true }
        );
        res.status(201).json(updatedMovie);
      } catch (error) {
        res.status(500).json(error);
        console.log(error);
      }
    } else {
      res.status(403).json("you are not allowed");
    }
  },
  Delete: async (req, res, next) => {
    if (req.user.isAdmin) {
      try {
        await Movie.findByIdAndDelete(req.params.id);
        res.status(200).json("Mvie has been deleted");
      } catch (error) {
        res.status(500).json(error);
        console.log(error);
      }
    } else {
      res.status(403).json("you are not allowed");
    }
  },
  GetAllList: async (req, res, next) => {
    if (req.user.isAdmin) {
      try {
        const movies = await Movie.find();
        res.status(200).json(movies);
      } catch (error) {
        res.status(500).json(error);
        console.log(error);
      }
    } else {
      res.status(403).json("you are not allowed");
    }
  },
  GetRandomList: async (req, res, next) => {
  
    try {
      const page = req.query.page || 1;
      const limit = req.query.limit || 12;
  
      let params = {};
  
      if (req.query.type) {
        params["type"] = req.query.type;
      }
      if (req.query.genre) {
        params["genre"] = { $in: [req.query.genre] };
      }
      if (req.query.title) {
        params = {
          title: {
            $regex: new RegExp(req.query.title, "i"),
          },
        };
      }
      if (req.query.id) {
        params = {
          _id:new ObjectId(req.query.id)
        };
      }
      
      const count =!req.query.id ?await Movie.countDocuments(params):0

      const totalPage = Math.ceil(count / limit);
      const skip = (Number(page) - 1) * limit;
      // params =

      let movie = await Movie.aggregate([
        {
          $match: params,
        },
        // { $sort: { title: -1 } },
        { $skip: skip },
        { $limit: limit },
        //   { $count: "total" },
      ]);
      console.log(movie.length);
      if (movie.length === 0) {
        res.status(404).json({ message: "No record found" });
      }
      if (movie.length > 0) {
        res.status(200).json({ result: movie, totalPage });
      }
    } catch (error) {
      res.status(500).json(error);
      console.log(error);
    }
  },
  Gegenrelist: async (req, res) => {
    var x =
      "Romance,Comedy,Drama,Harem,Music,Action,Sports,Fantasy,SileceOfLife,Supernatural,Adventure,Seinin,PostApocalyptic,Thriller,Shonen,Mecha,Mystery,Isekai,Historical,MagicalGirls,Hooror,Jdrama,Shojo,Idols,Food,MartialArts,Sgdrama,Family";
    x = x.split(",");
    res.send(x);
  },
};
