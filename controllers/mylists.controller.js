const mongoose = require("mongoose");
const MyListModel = require("../models/MyListModel");
module.exports = UserController = {
  Add: async (req, res) => {
    try {
      //    const exist= await User.findOne({userId:req.user._id,mylist:{$elemMatch:{id:req.body.listid}}})
      const exist = await MyListModel.aggregate([
        {
          $match: {
            userId: mongoose.Types.ObjectId(req.user._id), // Convert req.user._id to ObjectId if not already
            content: {
              $elemMatch: {
                $eq: mongoose.Types.ObjectId(req.body.listid), // Convert req.body.listid to ObjectId if not already
              },
            },
          },
        },
      ]);
      console.log("--------------------------------", exist);
      if (exist.length > 0) {
        return res.status(200).json({ result: exist[0]?.content });
      } else {
        let data = await MyListModel.findByIdAndUpdate(
          { userId: req.user._id },
          { $push: { content: req.body.listid } }
        );
        console.log({ data });
        return res.status(200).json({ result: data[0]?.content });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json(error.message);
    }
  },
  Delete: async (req, res) => {
    try {
        let data = await MyListModel.findByIdAndUpdate(
            req.user._id,
            { $pull: { content: mongoose.Types.ObjectId(req.query.listid) } }
        );

        console.log({ data });

        return res.status(200).json({ message: "Item removed successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json(error.message);
    }
},
  GetAllUser: async (req, res) => {
    try {
      let User;
      if (req.query.mylist) {
        User = await MyListModel.aggregate([
          {
            $match: {
              userId: mongoose.Types.ObjectId(req?.user?._id),
            },
          },
          {
            $lookup: {
              from: "movies",
              foreignField: "_id",
              localField: "content",
              as: "content",
            },
          },
          {
            $project: {
              userId: 1,
              content: 1,
            },
          },
        ]);
        return res.status(200).json({ result: User[0]?.content });
      } else {
        User = await MyListModel.aggregate([
          {
            $match: {
              userId: mongoose.Types.ObjectId(req?.user?._id),
            },
          },

          {
            $project: {
              userId: 1,
              content: 1,
            },
          },
        ]);
        return res.status(200).json({ result: User[0]?.content });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  },
};
