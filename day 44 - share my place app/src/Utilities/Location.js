// Yet again we will use two different methods here, since Google Maps API is only available with a credit card, I had to do this
const GOOGLE_API_KEY = 'toopoorforthis';

async function getCoordsFromAddressUsingGoogle(address) {
    // We have an async function which should return a promise, this promise comes from the API itself which we call with fetch
    // First we need to convert address into a string that can be used in URLs, we have a builtin funciton for that
    const urlAddress = encodeURI(address);
    const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${urlAddress}&key=${GOOGLE_API_KEY}`
    );
    // Now if this response is not ok then the request failed
    if (!response.ok) {
        throw new Error('Failed to fetch coordinates. Try again');
    }
    // We should store the response in an object
    const data = response.json();
    // if the data has an error_message property then we can display it
    if (data.error_message) {
        throw new Error(data.error_message);
    }

    // Finally we can get the coordinates from the response and return it
    return data.results[0].geometry.location;
}

// Now to actually use Nominatim's geocoding API for this
// For geocoding, we have an endpoint 'search' which offers two ways to search, using freeform query, or structured
// For structured, we'd need to be able to divide address into city, country, etc, which I don't think we can do here
// So I'll use freeform. This problem was avoided by the course's guide for free tools by sending dummy data instead
async function getCoordsFromAddressNominatim(address) {
    const urlAddress = encodeURI(address);
    // const response = await fetch(
    //     `https://nominatim.openstreetmap.org/search?q=${urlAddress}`
    // );
    // But since Nominatim doesn't send CORS headers, we need to either use server side, but I don't have a backend here
    // or we can use a CORS proxy like cors anywhere, I'll have to resort to the latter, because another option is to run server ourself
    const response = await fetch(
        `https://api.cors.lol/?url=https://nominatim.openstreetmap.org/search?q=${urlAddress}&format=json&limit=1`
    );

    if (!response.ok) {
        throw new Error('Failed to fetch coordinates. Try again');
    }
    const data = await response.json();

    // For the coordinates, it is simple
    const coordinates = { lat: data[0].lat, long: data[0].lon };
    return coordinates;
}

// Even with the proxy I'm getting weird errors so I'm gonna ditch this route entirely and use some other API
// I'll try LocationIQ to see if it works. This will be the last service I try
const LOCATIONIQ_API_KEY = 'pk.de0ae4c536b2a49df2befc3a8229';

// eecc before 8229 but I'll have pseudo-protected the key with this comment, sorry LocationIQ, I might need it later as well
export async function getCoordsFromAddress(address) {
    const urlAddress = encodeURI(address);
    const response = await fetch(
        `https://us1.locationiq.com/v1/search?key=${LOCATIONIQ_API_KEY}&q=${urlAddress}&format=json&`
    );

    if (!response.ok) {
        throw new Error('Failed to fetch coordinates. Try again');
    }
    const data = await response.json();
    console.log(data);

    const coordinates = { lat: data[0].lat, long: data[0].lon };
    return coordinates;
}
// Okay this works, nice

// Now the next task is reverse geocoding i.e. getting address from coordinates
// I'll exclude the Google version because it would be very similar anyway
export async function getAddressFromCoords(coords) {
    const response = await fetch(
        `https://us1.locationiq.com/v1/reverse?key=${LOCATIONIQ_API_KEY}&lat=${coords.lat}&lon=${coords.long}&format=json&`
    );

    if (!response.ok) {
        throw new Error('Failed to fetch address. Try again');
    }
    const data = await response.json();
    console.log(data);

    return data.display_name;
}
