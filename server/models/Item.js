const mongoose = require('mongoose');

const itemSchema = mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    pricePerDay: { type: Number, required: true },
    quantity: { type: Number, required: true },
    images: [{ type: String }],
    isFeatured: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Item', itemSchema);
