const asyncHandler = require('express-async-handler');
const Package = require('../models/Package');

// @desc    Fetch all packages
// @route   GET /api/packages
// @access  Public
const getPackages = asyncHandler(async (req, res) => {
    const packages = await Package.find({});
    res.json(packages);
});

// @desc    Create a package
// @route   POST /api/packages
// @access  Admin
const createPackage = asyncHandler(async (req, res) => {
    const { name, description, price, images, isFeatured } = req.body;
    const pkg = new Package({ name, description, price, images, isFeatured });
    const createdPackage = await pkg.save();
    res.status(201).json(createdPackage);
});

// @desc    Delete a package
// @route   DELETE /api/packages/:id
// @access  Admin
const deletePackage = asyncHandler(async (req, res) => {
    const pkg = await Package.findById(req.params.id);
    if (pkg) {
        await pkg.deleteOne();
        res.json({ message: 'Package removed' });
    } else {
        res.status(404);
        throw new Error('Package not found');
    }
});

module.exports = { getPackages, createPackage, deletePackage };
