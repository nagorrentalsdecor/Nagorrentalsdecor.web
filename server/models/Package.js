const mongoose = require('mongoose');

const packageSchema = mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    images: [{ type: String }], // URLs or paths
    price: { type: Number, required: true }, // 0 for "Request Quote" logic if needed
    isFeatured: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Package', packageSchema);
