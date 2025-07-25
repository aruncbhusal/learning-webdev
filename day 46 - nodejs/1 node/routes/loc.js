// Inside this we need to import the express module
const express = require('express');
// Additionally, we need to also listen to requests, we might have two types of requests with location data from the client side js

const router = express.Router();
// We can use this router to handle the different requests on different routes

const locationStorage = {
    locations: [],
};

router.post('/add-location', (req, res, next) => {
    // In this method we can simply add the incoming coordinate to the database (initially we'll use  asimple object array for storage)
    const id = Math.random();
    locationStorage.locations.push({
        id: id,
        address: req.body.address,
        coordinates: {
            lat: req.body.lat,
            lng: req.body.lng,
        },
    });
    // Now we can send them the message that location has been saved

    // But we get CORS errors: https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS

    res.json({ message: 'Location saved', locId: id });
});

router.get('/location/:lid', (req, res, next) => {
    // Now in this route, we need to also add :lid as a part of the route which simply creates a new params variable called lid with the value
    // We can access the params by simply using req.params
    const locId = +req.params.lid; // Using + which is similar to parseFloat()
    const location = locationStorage.locations.find((loc) => (loc.id = locId));
    // We can use the find method just like normal JS
    // But if the location id is invalid, location will be falsy and we need to handle that case as well
    if (!location) {
        // We can use the satus method and chain it with the json output method to send a more complete response
        return res.status(404).json({ message: 'Not Found' });
    }
    // Finally we return the json data containing the address and coordinates
    res.json({ address: location.address, coordinates: location.coordinates });
});

// We also need to export the module here, but the method for exporting is different from browser JS
module.exports = router;

// I'm feeling sleepy so I'll add comments to the MongoDB part tomorrow, for now I'll just copy paste the file into the current folder
// In the view the code was simply copied from the docs, so I'll do similar, but will comment tomorrow
