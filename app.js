require('dotenv').config();

const express = require('express');
const session = require('express-session');
const path = require('path');

const uploadRoute = require('./routes/upload');

const app = express();

// -----------------------------
// View Engine
// -----------------------------
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// -----------------------------
// Middleware
// -----------------------------
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/public', express.static(path.join(__dirname, 'public')));

// -----------------------------
// Session
// -----------------------------
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 24 * 60 * 60 * 1000 // 1 Day
        }
    })
);

// -----------------------------
// Home
// -----------------------------
app.get('/', (req, res) => {

    if (req.session.user) {
        return res.redirect('/dashboard');
    }

    return res.redirect('/login');

});

// -----------------------------
// Login Page
// -----------------------------
app.get('/login', (req, res) => {

    if (req.session.user) {
        return res.redirect('/dashboard');
    }

    res.render('login', {
        error: null
    });

});

// -----------------------------
// Login Action
// -----------------------------
app.post('/login', (req, res) => {

    const { username, password } = req.body;

    if (
        username === 'admin' &&
        password === 'Admin@123'
    ) {

        req.session.user = {
            username: username
        };

        return res.redirect('/dashboard');

    }

    return res.render('login', {
        error: 'Invalid Username or Password'
    });

});

// -----------------------------
// Dashboard
// -----------------------------
app.get('/dashboard', (req, res) => {

    if (!req.session.user) {
        return res.redirect('/login');
    }

    res.render('dashboard', {
        username: req.session.user.username
    });

});

// -----------------------------
// Upload Route
// -----------------------------
app.use('/upload', uploadRoute);

// -----------------------------
// Logout
// -----------------------------
app.get('/logout', (req, res) => {

    req.session.destroy(() => {

        res.redirect('/login');

    });

});

// -----------------------------
// 404 Page
// -----------------------------
app.use((req, res) => {

    res.status(404).send("<h2>404 - Page Not Found</h2>");

});

// -----------------------------
// Error Handler
// -----------------------------
app.use((err, req, res, next) => {

    console.error(err);

    res.status(500).send("Internal Server Error");

});

// -----------------------------
// Start Server
// -----------------------------
app.listen(process.env.PORT, () => {

    console.log(`🚀 Server Started on Port ${process.env.PORT}`);

});
