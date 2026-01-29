const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema({
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    eventType: { type: String, required: true },
    eventDate: { type: Date, required: true },
    location: { type: String, required: true },

    selectedPackage: { type: mongoose.Schema.Types.ObjectId, ref: 'Package' },
    rentedItems: [{
        item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
        quantity: { type: Number, required: true }
    }],

    totalCost: { type: Number, required: true, default: 0.0 },
    status: { type: String, required: true, default: 'Pending', enum: ['Pending', 'Approved', 'Completed', 'Cancelled'] },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
