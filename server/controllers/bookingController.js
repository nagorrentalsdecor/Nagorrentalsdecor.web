const asyncHandler = require('express-async-handler');
const Booking = require('../models/Booking');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Public
const createBooking = asyncHandler(async (req, res) => {
    const { customerName, phone, email, eventType, eventDate, location, selectedPackage, rentedItems, totalCost } = req.body;

    const booking = new Booking({
        customerName,
        phone,
        email,
        eventType,
        eventDate,
        location,
        selectedPackage,
        rentedItems,
        totalCost
    });

    const createdBooking = await booking.save();
    res.status(201).json(createdBooking);
});

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Admin
const getBookings = asyncHandler(async (req, res) => {
    const bookings = await Booking.find({}).sort({ createdAt: -1 });
    res.json(bookings);
});

// @desc    Update booking status
// @route   PUT /api/bookings/:id
// @access  Admin
const updateBookingStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (booking) {
        booking.status = status;
        const updatedBooking = await booking.save();
        res.json(updatedBooking);
    } else {
        res.status(404);
        throw new Error('Booking not found');
    }
});

module.exports = { createBooking, getBookings, updateBookingStatus };
