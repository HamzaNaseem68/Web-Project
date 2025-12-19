const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainController');

router.get('/', (req, res) => res.render('home'));
router.get('/services', (req, res) => res.render('services'));
router.get('/training', (req, res) => res.render('training'));
router.get('/testimonials', (req, res) => res.render('testimonials'));
router.get('/checkout', (req, res) => res.render('checkout'));
router.get('/products', (req, res) => res.render('products'));
router.get('/contact', (req, res) => res.render('contact'));

module.exports = router;
