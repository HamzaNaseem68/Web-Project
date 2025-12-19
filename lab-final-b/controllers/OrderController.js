const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Add product to session cart
// @route   POST /order/cart/add
exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        console.log("Adding to cart - Product ID:", productId);
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const cartItem = {
            productId: product._id.toString(), // Store as string for easy comparison
            name: product.name,
            price: product.price || 0,
            quantity: parseInt(quantity) || 1
        };

        if (!req.session.cart) req.session.cart = [];

        // Check if item already in cart
        const existingItemIndex = req.session.cart.findIndex(item => item.productId.toString() === productId);
        if (existingItemIndex > -1) {
            req.session.cart[existingItemIndex].quantity += cartItem.quantity;
        } else {
            req.session.cart.push(cartItem);
        }
        console.log("✅ Cart updated. Current items:", JSON.stringify(req.session.cart));

        // Explicitly Save Session
        req.session.save((err) => {
            if (err) {
                console.error("❌ Session save error:", err);
                return res.status(500).json({ error: 'Session save error' });
            }
            console.log("💾 Session successfully saved for ID:", req.sessionID);
            res.json({ message: 'Added to cart', cartCount: req.session.cart.length });
        });
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
};

// @desc    Get order preview
// @route   GET /order/preview
exports.getOrderPreview = (req, res) => {
    console.log("--- Loading Order Preview ---");
    console.log("Session ID:", req.sessionID);
    console.log("Items in cart:", req.session.cart ? req.session.cart.length : 'NONE');

    const cart = req.session.cart || [];
    let originalTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    const discountPercent = req.discountInfo ? req.discountInfo.percent : 0;
    const discountAmount = (originalTotal * discountPercent) / 100;
    const finalTotal = originalTotal - discountAmount;

    res.render('orderPreview', {
        cart,
        originalTotal,
        discountAmount,
        finalTotal,
        couponCode: req.discountInfo ? req.discountInfo.code : '',
        email: req.query.email || '' // Pass email from query if exists
    });
};

// @desc    Confirm and finalize order
// @route   POST /order/confirm
exports.confirmOrder = async (req, res) => {
    try {
        const email = req.body.email ? req.body.email.toLowerCase().trim() : '';
        const cart = req.session.cart || [];
        console.log("Confirming Order for Email:", email, "Cart Items:", cart.length);

        if (cart.length === 0) {
            return res.redirect('/order/preview?error=Empty cart');
        }

        let originalTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

        // Re-apply discount logic for saving to DB
        const couponCode = req.body.coupon;
        let discountAmount = 0;
        if (couponCode === 'SAVE10') {
            discountAmount = (originalTotal * 10) / 100;
        }

        const finalTotal = originalTotal - discountAmount;

        const order = await Order.create({
            email,
            items: cart.map(item => ({
                name: item.name,
                price: item.price,
                quantity: item.quantity
            })),
            originalTotal,
            discount: discountAmount,
            finalTotal,
            status: 'Placed'
        });

        // Clear cart
        req.session.cart = [];

        res.render('orderSuccess', { order });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error placing order');
    }
};

// @desc    Get order history for customer
// @route   GET /my-orders
exports.getMyOrders = async (req, res) => {
    const email = req.query.email ? req.query.email.toLowerCase().trim() : '';
    console.log("Searching orders for email:", email);
    let orders = [];
    if (email) {
        orders = await Order.find({ email }).sort({ createdAt: -1 });
    }
    res.render('orderHistory', { orders, email });
};

// @desc    Get all orders (Admin)
// @route   GET /order/admin/manage
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.render('adminOrders', { orders });
    } catch (error) {
        res.status(500).send('Server Error');
    }
};

// @desc    Update order status (Admin)
// @route   POST /order/admin/status
exports.updateStatus = async (req, res) => {
    try {
        const { orderId, nextStatus } = req.body;
        const order = await Order.findById(orderId);

        if (!order) return res.status(404).json({ error: 'Order not found' });

        const statusSequence = ['Placed', 'Processing', 'Delivered'];
        const currentIndex = statusSequence.indexOf(order.status);
        const nextIndex = statusSequence.indexOf(nextStatus);

        if (nextIndex !== currentIndex + 1) {
            return res.status(400).json({ error: `Cannot move from ${order.status} to ${nextStatus}` });
        }

        order.status = nextStatus;
        await order.save();
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
};
