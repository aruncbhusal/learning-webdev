import { Map } from './UI/Map';

class LoadedPlace {
    constructor(coordinates, address) {
        new Map(coordinates);
        const headerTitleEl = document.querySelector('header h1');
        headerTitleEl.textContent = address;
    }
}

const url = new URL(location.href);
const queryParams = url.searchParams;
// const coords = {
//   lat: parseFloat(queryParams.get('lat')),
//   lng: +queryParams.get('lng')
// };
// const address = queryParams.get('address');
// Here we simply need to get the location Id parameter and then we make a fetch request to the backend, after which we load the map
const locId = queryParams.get('location');
fetch('http://localhost:3000/location/' + locId, locId)
    .then((response) => response.json())
    .then((data) => {
        new LoadedPlace(data.coordinates, data.address);
    });
