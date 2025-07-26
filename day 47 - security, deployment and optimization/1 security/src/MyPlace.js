import { Map } from './UI/Map';
import sanitizeHtml from 'sanitize-html';

class LoadedPlace {
    constructor(coordinates, address) {
        new Map(coordinates);
        const headerTitleEl = document.querySelector('header h1');
        // Here we might be using innerHTML, which takes any valid html and embeds it into our site
        // We could use textContent to avoid XSS attacks, but it might not always be possible or desired
        // So we need to be careful while allowing such behavior, and to avoid these injections we can use sanitize-html package
        // Then when we use sanitizeHtml function with the user generated input, we can restrict the input from having scripts/malicious code
        // This kind of sanitization should be done in the server side because it is too late to do it browser side, and it can be overridden
        headerTitleEl.innerHTML = sanitizeHtml(address);
    }
}

const url = new URL(location.href);
const queryParams = url.searchParams;
const coords = {
    lat: parseFloat(queryParams.get('lat')),
    lng: +queryParams.get('lng'),
};
const address = queryParams.get('address');
new LoadedPlace(coords, address);
