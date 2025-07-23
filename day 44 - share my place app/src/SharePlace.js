// The project has config files, html and css already set up so that we're using babel and supporting browsers >0.5% marketshare
// Our job is to populate the two files in this folder so that they can be bundled into assets/scripts by webpack
// Our goal is to create an app where we can select a location or autolocate ourselves and display on the map/share the location
// We will start with this file which handles the finding of a place
// We have two options: we can use procedural or object oriented approach. I'll stick with the course and use the object oriented approach
// First we can have a LocationFinder class which has the button actions and methods defined

// To use the modals we need to import them
import { Modal } from './UI/Modal';
// For map
import { Map } from './UI/Map';
// For Location
import {
    getCoordsFromAddress,
    getAddressFromCoords,
} from './Utilities/Location';

class LocationFinder {
    constructor() {
        const locateBtn = document.getElementById('locate-btn');
        const locateForm = document.querySelector('form');
        // Since there's only one form here, we can simply do this
        locateBtn.addEventListener('click', this.locateBtnHandler.bind(this));
        locateForm.addEventListener(
            'submit',
            this.locateFormHandler.bind(this)
        );
        // Since the 'this' context is lost when called by the browser, we need to bind it using bind()
        this.shareBtn = document.getElementById('share-btn');
        // Now let's add a handler for this as well
        this.shareBtn.addEventListener('click', this.sharePlaceHandler);
    }

    // We need a function that allows selecting a place inside the map, which does the map logic, and we can call it on geolocation success
    selectPlace(coords, address) {
        // Here we render a map, but creating the map each time is not good, we can execute render directly if map already exists
        if (this.map) {
            this.map.render(coords);
        } else {
            this.map = new Map(coords);
        }
        // We want to render the map, but also add a link to the input section of shareable link
        // For that we can select the share button in the class and then un-disable (yes, enable) it when the link is ready
        this.shareBtn.disabled = false;
        const sharedLinkInput = document.getElementById('share-link');
        sharedLinkInput.value = `${
            location.origin
        }/my-place?address=${encodeURI(address)}&lat=${coords.lat}&long=${
            coords.long
        }`;
        // Next up our job is to make sure that when we load this URL, we get displayed the other index.html file with the map
    }

    locateBtnHandler() {
        // This is executed when the user wants to autolocate themselves. We can look at the browser support for geolocation method
        // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/geolocation
        // It has very good support but if in case it is not supported we can add a warning
        if (!navigator.geolocation) {
            alert(
                'Autolocation feature is not supported, please use a newer browser or enter address manually'
            );
        }
        // But before we get the location, we can add a modal and a backdrop so that the user knows the location is being retrieved
        // For that we create a new folder for UI and create a new file for Modal and have a new class there
        const modal = new Modal(
            'loading-modal-content',
            'Your location is being loaded — Please wait.'
        );
        modal.show();

        // To find the location we use the getCurrentPosition method with success and error callbaks
        navigator.geolocation.getCurrentPosition(
            async (success) => {
                // The success object has properties we can use
                const location = {
                    lat: success.coords.latitude,
                    long: success.coords.longitude,
                };
                // console.log(location);
                // After we get the coordinates, we can find the address as well
                const address = await getAddressFromCoords(location);
                // We will only hide modal once this is done as well
                modal.hide();
                this.selectPlace(location, address);
            },
            (error) => {
                modal.hide();
                alert(
                    'An error occured, please try again or enter address manually.'
                );
            }
        );
    }

    locateFormHandler(event) {
        // When the user enters an address into the form and submits, we need to first prevent th edefault behavior from occuring
        // Then we can validate user input and finally call the geocoding API to translate address into coordinates
        event.preventDefault();
        // We can select the input field from the event node
        const address = event.target.querySelector('input').value;
        if (!address || address.trim().length === 0) {
            alert(
                'Invalid address, please enter a valid address before trying again.'
            );
            return;
        }
        // Now we can call the locator, for which we can create a new folder for utilities and create a new file for Location
        const modal = new Modal(
            'loading-modal-content',
            'Your location is being loaded — Please wait.'
        );
        modal.show();

        // We should use a try-catch block as well
        // We could make this into async await as well, but we'll spice it up for now
        try {
            coordinates = getCoordsFromAddress(address).then((coords) => {
                this.selectPlace(coords, address);
            });
        } catch (error) {
            alert(error.message);
        }
        modal.hide();
    }

    sharePlaceHandler() {
        // We need to use the clipboard API here so we need to check if it is available
        // Looked around and found out there was a neat "select" method to select text in an input field
        const shareLink = document.getElementById('share-link');
        if (!navigator.clipboard) {
            shareLink.select();
            // I searched for it because it felt nice, but apparently the course itself covered this, wasted effort smh
            alert(
                "Can't add to clipboard. Please copy the link in the text box to share it."
            );
            return;
        }
        // If we have clipboard ability, we can then write it into the clipboard
        const text = shareLink.value;
        navigator.clipboard
            .writeText(text)
            .then(() => {
                alert('Copied to clipboard!');
            })
            .catch((err) => {
                console.log(err);
                shareLink.select();
            });
    }
}

// We can simply create a new object with new or store it in a variable
const sharePlace = new LocationFinder();
