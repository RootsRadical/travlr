const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Controllers
const tripsController = require('../controllers/trips');
const authController = require('../controllers/authentication');

// JWT Middleware
function authenticateJWT(req, res, next) {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        console.warn('Authorization header is missing');
        return res.status(401).json({ error: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        console.warn('Bearer token is missing');
        return res.status(401).json({ error: 'Bearer token missing' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.warn('JWT verification failed:', err.message);
            return res.status(401).json({ error: 'Invalid token' });
        }

        req.auth = decoded;
        next();
    });
}

// Auth routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Trip routes
router
    .route('/trips')
    .get(tripsController.tripsList)
    .post(authenticateJWT, tripsController.tripsAddTrip);

router
    .route('/trips/:tripCode')
    .get(tripsController.tripsFindByCode)
    .put(authenticateJWT, tripsController.tripsUpdateTrip);

module.exports = router;
