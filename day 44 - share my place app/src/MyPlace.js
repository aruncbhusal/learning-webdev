// Now we need to make the other index.js work, which gets loaded when we have the URL generated from the location search
// We need to render the map here as well so let's get that handled here as well as in the index.html file

import { Map } from './UI/Map';

class PlaceLoader {
    constructor(coords, address) {
        // In the constructor we need to create the map object and render it with the coords we have
        new Map(coords);
        // Plus we also need to modify the h1 header to the address that was passed
        // We're only using this because we're sticking to the OOP paradigm, else this is just a single function
        const headerEl = document.querySelector('header h1');
        headerEl.textContent = address;
    }
}

// Now in order to create the PlaceLoader object, we need the coordinates and address which are in the URL parameters
// We have a URL class in JS which can take a URL and get the parameters from it
const url = new URL(location.href);
// The href property of location gives the url of the current page/location
const params = url.searchParams;
const coordinates = {
    lat: params.get('lat'),
    long: params.get('long'),
};
const address = params.get('address');
// Finally we can create the object
new PlaceLoader(coordinates, address);
