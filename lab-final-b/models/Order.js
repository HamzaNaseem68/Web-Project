const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    items: [{
        name: String,
        price: Number,
        quantity: Number
    }],
    originalTotal: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        default: 0
    },
    finalTotal: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Placed', 'Processing', 'Delivered'],
        default: 'Placed'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Order', orderSchema);
