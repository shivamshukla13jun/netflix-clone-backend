const { default: axios } = require("axios");
const mongoose=require('mongoose')
const Movie=require('../models/Movie')
module.exports = MoviesController = {
  Add: async (req, res) => {
    // if(req.user.isAdmin){
    try {
      const newMovie = new Movie({
        title: req.body.title,
        desc: req.body.desc,
        img: req.files.img[0].filename,
        imgSm: req.files.imgSm[0].filename,
        trailer: req.files.trailer[0].filename,
        video: req.files.video[0].filename,
        year: req.body.year,
        limit: req.body.limit,
        genre: req.body.genre,
        isSeries: req.body.isSeries,
      });
      const savedMovie = await newMovie.save();
      console.log(savedMovie);
      res.status(200).json(savedMovie);
    } catch (error) {
      res.status(500).json(error);
      console.log(error);
    }
    //   }
    //   else{
    //       res.status(403).json("you are not allowed")
    //     }
  },
  TotalCount: async (req, res) => {
    // if(req.user.isAdmin){
    try {
      const count=await Movie.countDocuments()
      res.status(200).json({total:count});
    } catch (error) {
      res.status(500).json(error);
      console.log(error);
    }
    //   }
    //   else{
    //       res.status(403).json("you are not allowed")
    //     }
  },
  MultipleAdd: async (req, res) => {
   try {
    // if(req.user.isAdmin){
      let saveddata = await Movie.insertMany();
      res.send(req.body)
    } catch (error) {
      res.status(500).json(error);
      console.log(error);
    }
    //   }
    //   else{
    //       res.status(403).json("you are not allowed")
    //     }
  },
  FindById: async (req, res) => {
    try {
      console.log({id:req.params.id})
      const updatedMovie = await Movie.findById({_id:req.params.id});
      console.log(updatedMovie)
          res.send(updatedMovie);
    } catch (error) {
      res.status(500).json(error);
      console.log(error);
    }
  },
  Update: async (req, res) => {
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
  UpdateById: async (req, res) => {
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
  Delete: async (req, res) => {
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
  GetAllList: async (req, res) => {
    // if (req.user.isAdmin) {
      try {
        const movies = await Movie.find();
        res.status(200).json(movies);
      } catch (error) {
        res.status(500).json(error);
        console.log(error);
      }
    // }
    //  else {
    //   res.status(403).json("you are not allowed");
    // }
  },
  GetRandomList: async (req, res) =>
   {
    
   try {
    const page=req.body.page || 1
    const limit=req.body.limit || 12
    const genrequery={genre: { $in: req.body.genre }}
    const count=await Movie.countDocuments(genrequery)
    const totalPage=Math.ceil(count/limit);
    const skip = (Number(page) - 1) * limit;
    let params;
   
    if(req.body.type){
      params= {type: req.body.type}
    }
    if(req.body.genre){
      params= {genre: { $in: req.body.genre }}
    }
    if(req.body.genre && req.body.type){
      params= {type: req.body.type,genre: { $in: req.body.genre }}
    }
    try {
      // params =
      const SearchQuery={title: {
        $regex: new RegExp(req.body.title, 'i')
      }}
      let movie;
      if ( req.body.type || req.body.genre) {
        movie = await Movie.aggregate([
          {
            $match: params,
          },
          // { $sort: { title: -1 } },
          { $skip: skip },
          { $limit: limit },
        //   { $count: "total" },
        ]);
        console.log(movie.length)
        res.status(200).json({result:movie,totalPage});
      }
      else if(req.body.title){
        movie = await Movie.aggregate([
          {
            $match:SearchQuery,
          },
          // { $sort: { title: -1 } },
          { $skip: skip },
          { $limit: limit },
        //   { $count: "total" },
        ]);
        res.status(200).json({result:movie,totalPage});
      }
      else {
        movie = await Movie.aggregate([
          // { $sort: { title: -1 } },
          { $skip: skip },
          { $limit: limit },
        //   { $count: "total" },
        ]);
        res.status(200).json({result:movie,totalPage});
      }
    } catch (error) {
      res.status(500).json(error);
      console.log(error);
    }
   } catch (error) {
    console.log(error);
   }
 
  },
  Gegenrelist:async (req,res)=>{
   try {
    var x="Romance,Comedy,Drama,Harem,Music,Action,Sports,Fantasy,SileceOfLife,Supernatural,Adventure,Seinin,PostApocalyptic,Thriller,Shonen,Mecha,Mystery,Isekai,Historical,MagicalGirls,Hooror,Jdrama,Shojo,Idols,Food,MartialArts,Sgdrama,Family"
    x=x.split(',');
    res.send(x);
   } catch (error) {
    console.log(error.message)
   }
  },
};
