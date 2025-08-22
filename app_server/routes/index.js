const express = require('express');
const router = express.Router();

//This is where we import the controllers we will route
const tripsController = require('../controllers/trips');

/* GET home page. */
router
    .route('trips')
    .get(tripsController.tripsList)
    .post(tripsController.tripsAddTrip);

router
    .route('/trips/:tripCode')
    .get(tripsController.tripsFindByCode)
    .put(tripsController.tripsUpdateTrip);

module.exports = router;
