const mongoose = require("mongoose");
const MyListModel = require("../models/MyListModel");
module.exports  = {
  Add: async (req, res) => {
    try {
      console.log(req.user);
      const userId = mongoose.Types.ObjectId(req.user.id);
      const listId = mongoose.Types.ObjectId(req.body.listid);
      let data = null;

      // Check if the user's list already exists
      const [exist] = await MyListModel.aggregate([
        { $match: { userId: userId } },
        { $limit: 1 }
      ]);

      if (exist) {
        // Check if the listId already exists in the content array
        const isItemInList = await MyListModel.findOne({ 
          userId: userId, 
          content: listId 
        });

        if (isItemInList) {
          return res.status(400).json({ message: 'Item already exists in the list' });
        }

        data = await MyListModel.findOneAndUpdate(
          { userId: userId },
          { $addToSet: { content: listId } }, // Use $addToSet to ensure uniqueness
          { new: true }
        );
        return res.status(200).json({ result: data.content });
      } else {
        data = await MyListModel.create({
          userId: userId,
          content: [listId]
        });
        return res.status(200).json({ result: data.content });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  },
  Delete: async (req, res) => {
    try {
      const listId = req.query.listid;
      if (!mongoose.Types.ObjectId.isValid(listId)) {
        return res.status(400).send({ error: "Invalid list ID" });
      }
  
      const data = await MyListModel.findOneAndUpdate(
        { userId: req.user.id },
        { $pull: { content: mongoose.Types.ObjectId(listId) } },
        { new: true }
      );
  
      if (!data) {
        return res.status(404).send({ error: "List not found" });
      }

        return res.status(200).json({ message: "Item removed successfully" ,data:data});
    } catch (error) {
        console.log(error);
        return res.status(500).json(error.message);
    }
},
  GetAllUser: async (req, res) => {
    try {
      let {isMylistpage=0}=req.query
      const pipeline=[
        {
          $match: {
            userId: mongoose.Types.ObjectId(req.user.id),
          },
        },
      ]
      isMylistpage==1 && pipeline.push({
        $lookup:{
          from:"movies",
          localField:"content",
          foreignField:"_id",
          as :"content"
        }
      },{
        $project:{
          "content.title":1,
          "content._id":1,
          "content.lang":1,
          "content.imageurl":1,
          "content.poster":1
        }
      }
    )
      pipeline.push({ $limit: 1 })
      const [data] = await MyListModel.aggregate(pipeline);
    
      if (!data) {
        return res.status(404).json({ message: "No data found" });
      }
    
      console.log("mylists", data);
      return res.status(200).json(data.content);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error", error });
    }
    
  },
};
