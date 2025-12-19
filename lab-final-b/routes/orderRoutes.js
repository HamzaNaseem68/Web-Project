const express = require('express');
const router = express.Router();
const orderController = require('../controllers/OrderController');
const applyDiscount = require('../middlewares/discountMiddleware');

router.post('/cart/add', orderController.addToCart);
router.get('/preview', applyDiscount, orderController.getOrderPreview);
router.post('/confirm', orderController.confirmOrder);
router.get('/my-orders', orderController.getMyOrders);

// Admin Routes for Status Lifecycle
router.get('/admin/manage', orderController.getAllOrders);
router.post('/admin/status', orderController.updateStatus);

module.exports = router;
