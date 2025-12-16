const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    categories: {
        type: [String],
        required: true
    },
    id: { // Keeping 'id' field for compatibility if needed, but Mongo uses _id
        type: Number
    }
});

// Auto-increment ID simplified logic (optional, but good for display consistency with previous lab)
// Ideally relying on _id is better, but user asked for 'id'.
productSchema.pre('save', function (next) {
    if (!this.id) {
        this.id = Math.floor(Math.random() * 10000);
    }
    next();
});

module.exports = mongoose.model('Product', productSchema);
