const express = require('express');
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const router = express.Router();

// In order to use MongoDB in the project, we need to install mongodb module, and we need to set up a client here
// Then from the mongoDB site, we can get the url for the mongodb server that we can paste here
// I won't do it because it's just for this one file
const url =
    'mongodb+srv://maximilian:MfwKGzkrovQHJGbf@cluster0-ntrwp.mongodb.net/locations?retryWrites=true&w=majority';

const client = new MongoClient(url);

// This is not used, but instead we store data in the MongoDB database which is file based
const locationStorage = {
    locations: [],
};

router.post('/add-location', (req, res, next) => {
    // const id = Math.random();
    client.connect(function (err, client) {
        const db = client.db('locations');
        // First we donnect to the database using connect method

        // Insert a single document
        // To add an entry, we can use the insertOne Method, to which we can add an object as the argument
        db.collection('user-locations').insertOne(
            {
                address: req.body.address,
                coords: { lat: req.body.lat, lng: req.body.lng },
            },
            function (err, r) {
                // if (err) {}
                console.log(r);
                res.json({ message: 'Stored location!', locId: r.insertedId });
            }
        );
    });

    // locationStorage.locations.push({
    //   id: id,
    //   address: req.body.address,
    //   coords: { lat: req.body.lat, lng: req.body.lng }
    // });
});

router.get('/location/:lid', (req, res, next) => {
    const locationId = req.params.lid;

    client.connect(function (err, client) {
        const db = client.db('locations');
        // Similarly to get the item from the database we use findOne, which gets us the object which matches the id
        // The id is created itself by mongoDB so we don't need to create one, we can simply access it with _id

        // Insert a single document
        db.collection('user-locations').findOne(
            {
                _id: new mongodb.ObjectId(locationId),
            },
            function (err, doc) {
                // if (err) {}
                if (!doc) {
                    return res.status(404).json({ message: 'Not found!' });
                }
                res.json({ address: doc.address, coordinates: doc.coords });
            }
        );
    });
});

module.exports = router;
