const Product = require('../models/Product');

// @desc    Get all products
// @route   GET /api/products
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
};

// @desc    Add a product
// @route   POST /api/products
exports.createProduct = async (req, res) => {
    try {
        const { name, description, categories } = req.body;

        const product = await Product.create({
            name,
            description,
            categories: Array.isArray(categories) ? categories : categories.split(',').map(c => c.trim())
        });

        res.status(201).json(product);
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: 'Server Error' });
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
exports.updateProduct = async (req, res) => {
    try {
        // Note: Finding by _id because that's what Mongo uses. 
        // If client sends custom 'id', query logic needs adjustment. 
        // For now assuming we use Mongo's _id for operations.
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json({ message: 'Product removed' });
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
};
