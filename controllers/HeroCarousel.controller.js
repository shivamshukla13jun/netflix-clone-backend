const mongoose = require("mongoose");
const HeroCarousel = require("../models/HeroCarousel.model");
module.exports ={
  Add: async (req, res, next) => {
    try {
      const payload = { ...req.body, ...req.files };
      console.log(payload)
      const newHeroCarousel = new HeroCarousel(payload);
      const savedHeroCarousel = await newHeroCarousel.save();
      console.log(savedHeroCarousel);
      res.status(200).json(savedHeroCarousel);
    } catch (error) {
      next(error);
    }
  },


  FindById: async (req, res, next) => {
    try {
      console.log({ id: req.params.id });
      const updatedHeroCarousel = await HeroCarousel.findById(req.params.id).populate("genre");
      console.log(updatedHeroCarousel);
      res.json({data:updatedHeroCarousel});
    } catch (error) {
      res.status(500).json(error);
      console.log(error);
    }
  },
  Update: async (req, res, next) => {
      try {
        const { img, imgTitle, imgSm, trailer, video } = req.body;
        const updatedHeroCarousel = await HeroCarousel.findByIdAndUpdate(
           req.params.id,
          { $set: req.body },
          { new: true }
        );
        res.status(201).json(updatedHeroCarousel);
      } catch (error) {
        res.status(500).json(error);
        console.log(error);
      }
   
  },
  UpdateById: async (req, res, next) => {
    
      try {
        const updatedHeroCarousel = await HeroCarousel.findByIdAndUpdate(
          { _id: req.params.id },
          { $set: req.body },
          { new: true }
        );
        res.status(201).json(updatedHeroCarousel);
      } catch (error) {
        res.status(500).json(error);
        console.log(error);
      }
  
  },
  Delete: async (req, res, next) => {
   try {
        await HeroCarousel.findByIdAndDelete(req.params.id);
        res.status(200).json("Mvie has been deleted");
      } catch (error) {
        res.status(500).json(error);
        console.log(error);
      }
  },

  GetRandomList: async (req, res, next) => {
  
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit )|| 4;
      let params = {};
    
      const skip = (Number(page) - 1) * limit;

      let data = await HeroCarousel.aggregate([
        {
          $match: params,
        },
      
        { $sort: { title: -1 } },
        { $skip: skip },
        { $limit: limit }
      ]);
      
      return  res.status(200).json({ data: data });
    
    } catch (error) {
      res.status(500).json(error);
      console.log(error);
    }
  },

};
