const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3002;

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session Middleware
app.use(session({
    name: 'lab-final-session', // Unique name to avoid conflict with other ports
    secret: 'secure-pro-secret-key-123',
    resave: true,
    saveUninitialized: true,
    rolling: true,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    }
}));

// Global Middleware to make session available in EJS
app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.url}`);
    if (!req.session) {
        console.log("⚠️ No session found on request:", req.url);
    } else {
        if (!req.session.cart) {
            req.session.cart = [];
            console.log("🆕 New Session/Cart Initialized:", req.sessionID);
        } else {
            console.log("🛒 Existing Session ID:", req.sessionID, "| Items in cart:", req.session.cart.length);
        }
    }
    res.locals.session = req.session;
    next();
});

// Set View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static Files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
const mainRoutes = require('./routes/mainRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

app.use('/', mainRoutes);
app.use('/api/products', productRoutes);
app.use('/order', orderRoutes);

app.get('/test-session', (req, res) => {
    req.session.testCount = (req.session.testCount || 0) + 1;
    res.send(`Session ID: ${req.sessionID}<br>Test Count: ${req.session.testCount}<br>Cart Size: ${req.session.cart ? req.session.cart.length : 'N/A'}`);
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
