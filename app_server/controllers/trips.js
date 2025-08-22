const mongoose = require('mongoose');
const Trip = require('../models/travlr'); //register model
const Model = mongoose.model('trips');

//GET: /trips - lists all the trips
// regardless of outcome, response mustt include HTML status code
// and JSON message to the requesting client
const tripsList = async (req, res) => {
    const q = await Model
        .find({})
        .exec();

    //Uncomment the following line to show results of query
    //on the console
    console.log(q);

    if (!q) {
        return res
            .status(404)
            .json(err);
    } else {
        return res
            .status(200)
            .json(q);
    }
};

// GET: /trips/:tripCode - lists a single trip
// Regardless of outcome, reponse msut include HTML status code
// and JSON message to the requesting client
const tripsFindByCode = async (req, res) => {
    const q = await Model
        .find({'code': req.params.tripCode })
        .exec();

    console.log(q);

    if (!q) {
        return res
            .status(404)
            .json(err);
    } else {
        return res
            .status(200)
            .json(q);
    }
};
module.exports = {
    tripsList,
    tripsFindByCode
};

//POST: /trips - Adds a new Trip
//Regardless of outcome, response must include HTML status code
//and JSON message to the requesting client
// Define the function
const tripsAddTrip = async (req, res) => {
    const newTrip = new Trip({
        code: req.body.code,
        name: req.body.name,
        length: req.body.length,
        start: req.body.start,
        perPerson: req.body.perPerson,
        image: req.body.image,
        description: req.body.description
    });

    const q = await newTrip.save();

    if (!q) {
        return res.status(400).json({ message: "Trip not created" });
    } else {
        return res.status(201).json(q);
    }
};

const tripsUpdateTrip = async (req, res) => {
    try {
        const tripCode = req.params.tripCode;
        const updatedTrip = await Model.findOneAndUpdate(
            { code: tripCode },
            {
                code: req.body.code,
                name: req.body.name,
                length: req.body.length,
                start: req.body.start,
                perPerson: req.body.perPerson,
                image: req.body.image,
                description: req.body.description
            },
            { new: true } // Return the updated document
        ).exec();

        if (!updatedTrip) {
            return res.status(404).json({ message: "Trip not found" });
        }

        return res.status(200).json(updatedTrip);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};


module.exports = {
    tripsList,
    tripsFindByCode,
    tripsAddTrip,
    tripsUpdateTrip 
};
