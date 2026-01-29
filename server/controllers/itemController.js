const asyncHandler = require('express-async-handler');
const Item = require('../models/Item');

// @desc    Fetch all items
// @route   GET /api/items
// @access  Public
const getItems = asyncHandler(async (req, res) => {
    const items = await Item.find({});
    res.json(items);
});

// @desc    Create an item
// @route   POST /api/items
// @access  Admin
const createItem = asyncHandler(async (req, res) => {
    const { name, category, pricePerDay, quantity, images, isFeatured } = req.body;
    const item = new Item({ name, category, pricePerDay, quantity, images, isFeatured });
    const createdItem = await item.save();
    res.status(201).json(createdItem);
});

// @desc    Delete an item
// @route   DELETE /api/items/:id
// @access  Admin
const deleteItem = asyncHandler(async (req, res) => {
    const item = await Item.findById(req.params.id);
    if (item) {
        await item.deleteOne();
        res.json({ message: 'Item removed' });
    } else {
        res.status(404);
        throw new Error('Item not found');
    }
});

module.exports = { getItems, createItem, deleteItem };
