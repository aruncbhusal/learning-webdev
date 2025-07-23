// We were supposed to be using Google Maps here, I'll have the code here for it, even if it never is used
// I'll use an alternative for the app though, which may lack some features
// I'll create two classes and implement features side by side
class GoogleMaps {
    constructor(coords) {
        // We load the maps when the user sends in a co ordinate, by whatever means, in this case we can simply call the render method
        this.render(coords);
    }

    render(coords) {
        // Here we first check if the google object (available from the script used in the html above this script) exists
        if (!google) {
            alert(
                'There was an error loading the map library, please try again later!'
            );
            return;
        }
        // but if we have the object, we can create a new map using the Maps constructor
        // It takes two arguments, one for the DOM element where it is to be displayed, and an options object
        const map = new google.map.Maps(document.getElementById('map'), {
            center: coords,
            zoom: 16,
        });

        // Now we can also add a marker to this map which takes an options object as parameter that takes the coords and map object
        new google.map.Marker({
            position: coords,
            map: map,
        });
    }
}

// Now let's implement it the same way using OpenStreetMap and LeafletJS which are open source and don't need credit card
// For this we need to add CSS and JS for Leaflet, which we can add in the index.html
export class Map {
    constructor(coords) {
        // We also need to make map a class variable, so we can reference it
        this.map = null;
        this.render(coords);
    }

    render(coords) {
        // We get an object called 'L' which we can use to render the map
        if (!L) {
            alert(
                "The map library isn't available right now, please try again later."
            );
        }

        // This time we work with chained objects to set the map
        // The map method takes the id of the div where map is to be shown, coordinates are takesn in an array format, and then is the zoom
        if (this.map) {
            this.map.setView([coords.lat, coords.long], 16);
        } else {
            this.map = L.map('map').setView([coords.lat, coords.long], 16);
        }

        // Additionally we need an OpenStreetMap tile layer, for which we need to set up a URL template string
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 20,
            // We can also add an attribution for OSM's copyright, which is mandatory in production, but I'll omit it for now
        }).addTo(this.map);
        // The template are supposedly automatically filled based on the information we've already given above

        // Adding marker is relatively simple as well
        const marker = L.marker([coords.lat, coords.long]).addTo(this.map);
        // Interesting, we can even bind a popup to this marker
        marker.bindPopup('You are here.');
    }
}

// In the course 'tips', the alternative given was OpenLayers which too uses OSM. This code was recommended:
/* 
const map = new ol.Map({
  target: 'map',
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM()
    })
  ],
  view: new ol.View({
    center: ol.proj.fromLonLat([coordinates.lng, coordinates.lat]),
    zoom: 16
  })
});
*/
