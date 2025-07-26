// Writing Secure JS code
// We're starting from the finished Share My Place project, where I have done basically nothing to modify it yet

// Security Holes
// While writing Browser Side JS, like this file here, we need to avoid having code that has confidential data or user data
// Since when the browser loads the page, it downloads the js file and anyone can read it
// This is possible when we're storing something on the database and showing it to any user who visits the page
// In production environment, the code is minified and is harder to read, but we shouldn't rely on that
// When using the Google API key in our app, it can be locked to a certain IP address so only we can access it
// But there might be API keys which we need to avoid putting in the browser side JS
// The info like mongoDB url are kept inside server side code so people can't access it from the browser, but browser side shouldn't have that

// Cross Site Scripting (XSS)
// This is a popular attack pattern where a user may enter a JS script in place of an input field, or URL parameter, and it can be executed
// This is a problem when the "injected" code runs each time a user goes to the page.
// Modern browsers deliberately prevent these attacks as far as possible by avoiding running scripts from the user/outside
// But they can also use <img src="" onerror="<js code>"> where source being empty triggers the onerror attribute's JS code
// We can see this effect in MyPlace.js

// We might fix the security holes in our application properly, but we still might be exposed to XSS attacks
// When we use third party libraries, we allow the scripts to run on our app, but if the script was modified, or hacked, we might be vulnerable
// When installing packages, npm also checks for these, and lets us know if there are any open gaps i.e. vulnerabilities
// Some libraries may have many vulnerabilities, but if they run locally anyway, they may be less dangerous compared to the ones our app uses
// So we should always make sure we trust the third party whose libraries we're using, and trust that they secure their code as well
// Like when using Google's Map JS Toolkit here, we're trusting that Google won't add malicious code, and someone can't simply add that code
// To the existing script that we use. For smaller libraries, we can check the source code directly to find any such suspicious activity

// Cross Site Request Forgery (CSRF)
// This is more of a server side security vulnerability, which we can prevent by using CSRF tokens
// But it is another method of injecting script of html content that executes a script in which the user's intended actions are modified
// Someone might take you to a page with injected content, even when visiting a normal site, like a banking application, and access user cookies
// The server stores sessions for users when they login so that they can be used to validate them, and they store session IDs in the cookies
// If someone else can access those cookies, they can execute the script on the behalf of the user and make requests to the server
// In the case of banking, they might make a transfer request to the server when the user loads the page with injected content

// Cross Origin Request Sharing (CSRF)
// The browser by default prevents a server from accessing some other server (i.e. frontend server communicating with backend)
// Since they are from different sources/origins, but we can change the server side response headers to allow such data/request being sent
// This is used in our application as well while trying to send data to the backend while loading location data to/from database
// The JS modules are similarly protected, so that we are only allowed to run the modules from our own server for security reasons

import { Modal } from './UI/Modal';
import { Map } from './UI/Map';
import { getCoordsFromAddress, getAddressFromCoords } from './Utility/Location';

class PlaceFinder {
    constructor() {
        const addressForm = document.querySelector('form');
        const locateUserBtn = document.getElementById('locate-btn');
        this.shareBtn = document.getElementById('share-btn');

        locateUserBtn.addEventListener(
            'click',
            this.locateUserHandler.bind(this)
        );
        this.shareBtn.addEventListener('click', this.sharePlaceHandler);
        addressForm.addEventListener(
            'submit',
            this.findAddressHandler.bind(this)
        );
    }

    sharePlaceHandler() {
        const sharedLinkInputElement = document.getElementById('share-link');
        if (!navigator.clipboard) {
            sharedLinkInputElement.select();
            return;
        }

        navigator.clipboard
            .writeText(sharedLinkInputElement.value)
            .then(() => {
                alert('Copied into clipboard!');
            })
            .catch((err) => {
                console.log(err);
                sharedLinkInputElement.select();
            });
    }

    selectPlace(coordinates, address) {
        if (this.map) {
            this.map.render(coordinates);
        } else {
            this.map = new Map(coordinates);
        }
        this.shareBtn.disabled = false;
        const sharedLinkInputElement = document.getElementById('share-link');
        sharedLinkInputElement.value = `${
            location.origin
        }/my-place?address=${encodeURI(address)}&lat=${coordinates.lat}&lng=${
            coordinates.lng
        }`;
    }

    locateUserHandler() {
        if (!navigator.geolocation) {
            alert(
                'Location feature is not available in your browser - please use a more modern browser or manually enter an address.'
            );
            return;
        }
        const modal = new Modal(
            'loading-modal-content',
            'Loading location - please wait!'
        );
        modal.show();
        navigator.geolocation.getCurrentPosition(
            async (successResult) => {
                const coordinates = {
                    lat: successResult.coords.latitude + Math.random() * 50,
                    lng: successResult.coords.longitude + Math.random() * 50,
                };
                const address = await getAddressFromCoords(coordinates);
                modal.hide();
                this.selectPlace(coordinates, address);
            },
            (error) => {
                modal.hide();
                alert(
                    'Could not locate you unfortunately. Please enter an address manually!'
                );
            }
        );
    }

    async findAddressHandler(event) {
        event.preventDefault();
        const address = event.target.querySelector('input').value;
        if (!address || address.trim().length === 0) {
            alert('Invalid address entered - please try again!');
            return;
        }
        const modal = new Modal(
            'loading-modal-content',
            'Loading location - please wait!'
        );
        modal.show();
        try {
            const coordinates = await getCoordsFromAddress(address);
            this.selectPlace(coordinates, address);
        } catch (err) {
            alert(err.message);
        }
        modal.hide();
    }
}

const placeFinder = new PlaceFinder();
