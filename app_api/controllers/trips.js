const mongoose = require('mongoose');
const Trip = require('../models/travlr'); // Your Mongoose Trip model
const User = require('../models/user');

// GET: /trips - lists all the trips
const tripsList = async (req, res) => {
    try {
        const trips = await Trip.find({});
        if (!trips.length) {
            return res.status(404).json({ message: 'No trips found' });
        }
        res.status(200).json(trips);
    } catch (err) {
        console.error('Error retrieving trips:', err);
        res.status(500).json({ error: 'Server error', details: err });
    }
};

// GET: /trips/:tripCode - gets a trip by its code
const tripsFindByCode = async (req, res) => {
    try {
        const trip = await Trip.findOne({ code: req.params.tripCode });
        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }
        res.status(200).json(trip);
    } catch (err) {
        console.error('Error finding trip:', err);
        res.status(500).json({ error: 'Server error', details: err });
    }
};

// Helper: Extract user from JWT (set in middleware)
const getUser = async (req) => {
    if (req.auth?.email) {
        return await User.findOne({ email: req.auth.email });
    }
    return null;
};

// POST: /trips - adds a new trip (secured)
const tripsAddTrip = async (req, res) => {
    try {
        const user = await getUser(req);
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized: user not found' });
        }

        const requiredFields = [
            'code', 'name', 'length', 'start', 'resort',
            'perPerson', 'image', 'description'
        ];

        const missingFields = requiredFields.filter(field => !req.body[field]);
        if (missingFields.length) {
            return res.status(400).json({
                message: 'Missing required fields',
                missing: missingFields
            });
        }

        const newTrip = new Trip({ ...req.body });

        const savedTrip = await newTrip.save();
        res.status(201).json(savedTrip);

    } catch (err) {
        console.error('Error adding trip:', err);
        res.status(400).json({ message: 'Error adding trip', error: err });
    }
};

// PUT: /trips/:tripCode - updates an existing trip (secured)
const tripsUpdateTrip = async (req, res) => {
    try {
        const user = await getUser(req);
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized: user not found' });
        }

        const updatedTrip = await Trip.findOneAndUpdate(
            { code: req.params.tripCode },
            { ...req.body },
            { new: true, runValidators: true }
        );

        if (!updatedTrip) {
            return res.status(404).json({
                message: `Trip with code ${req.params.tripCode} not found`
            });
        }

        res.status(200).json(updatedTrip);

    } catch (err) {
        console.error('Error updating trip:', err);
        res.status(500).json({
            message: `Error updating trip with code ${req.params.tripCode}`,
            error: err
        });
    }
};

// Export the controller functions
module.exports = {
    tripsList,
    tripsFindByCode,
    tripsAddTrip,
    tripsUpdateTrip
};
