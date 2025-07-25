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
        // We can make a request to the backend server running at port 3000 using this, we need to run two servers are the same time
        // This time the code seems to already be here so I just add commentatory here.
        // We can send the body part as a JSON in the body argument of the fetch API.
        fetch('http://localhost:3000/add-location', {
            method: 'POST',
            body: JSON.stringify({
                address: address,
                lat: coordinates.lat,
                lng: coordinates.lng,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                console.log(data);
                // Along with the json data, we also need to modify the link so we bring the code outside to inside here
                this.shareBtn.disabled = false;
                const sharedLinkInputElement =
                    document.getElementById('share-link');
                // sharedLinkInputElement.value = `${
                //     location.origin
                // }/my-place?address=${encodeURI(address)}&lat=${coordinates.lat}&lng=${
                //     coordinates.lng
                // }`;
                // We can make the link have the location id only
                sharedLinkInputElement.value = `${location.origin}/my-place?locationId=${data.locId}`;
            });
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
