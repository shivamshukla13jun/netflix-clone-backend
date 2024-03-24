const Category = require('../models/Category.model');

module.exports = {
  Add: async (req, res) => {
    try {
      const newCategory = new Category({
        name: req.body.name,
        parent: req.body.parent
      });
      const savedCategory = await newCategory.save();
      res.status(200).json(savedCategory);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  Get: async (req, res) => {
    try {
      const category = await Category.findById(req.params.id);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  Update: async (req, res) => {
    try {
      const category = await Category.findById(req.params.id);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      if (req.body.name != null) {
        category.name = req.body.name;
      }
      if (req.body.parent != null) {
        category.parent = req.body.parent;
      }
      const updatedCategory = await category.save();
      res.json(updatedCategory);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  Delete: async (req, res) => {
    try {
      const category = await Category.findById(req.params.id);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      await category.remove();
      res.json({ message: 'Category deleted' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};
