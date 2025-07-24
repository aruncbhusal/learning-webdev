import React, { useState, useRef, useEffect } from 'react';

import SelectedPlace from '../UI/SelectedPlace';
import Modal from '../UI/Modal';
import Header from '../UI/Header';
import {
    getCoordsFromAddress,
    getAddressFromCoords,
} from '../Utility/Location';
import './SharePlace.css';

// Here, we can see that even css are imported to be bundled in with the js
// A lot of things are very similar to JS, like the usage of functions, but in this case these are functional components
// There is another way to create components using class but this method is modern and more preferred
const SharePlace = () => {
    // Here we have multiple useState assignments, which simply create a link with variables and their changes, and react to it throughout
    // We can get the resulting variable and function by destructuring the stuff returned by useState
    const [chosenCoords, setChosenCoords] = useState();
    const [chosenAddress, setChosenAddress] = useState();
    const [sharableLink, setSharableLink] = useState('');
    const [isLoading, setIsLoading] = useState();
    // We use useRef to get hold of DOM elements like input so that we can use the values, or other properties
    const addressInputRef = useRef();
    const shareLinkRef = useRef();

    // We can use useEffect to react to changes, here we react to changes on chosenAddress and chosenCoords
    useEffect(() => {
        if (chosenAddress && chosenCoords) {
            setSharableLink(
                `${window.location.origin}/my-place?address=${encodeURI(
                    chosenAddress
                )}&lat=${chosenCoords.lat}&lng=${chosenCoords.lng}`
            );
        }
    }, [chosenAddress, chosenCoords]);

    const pickAddressHandler = async (event) => {
        event.preventDefault();
        const address = addressInputRef.current.value;
        if (!address || address.trim().length === 0) {
            alert('Invalid address entered - please try again!');
            return;
        }
        setIsLoading(true);
        try {
            const coordinates = await getCoordsFromAddress(address);
            setChosenCoords(coordinates);
            setChosenAddress(address);
        } catch (err) {
            alert(err.message);
        }
        setIsLoading(false);
    };

    const getUserLocationHandler = async () => {
        if (!navigator.geolocation) {
            alert(
                'Location feature is not available in your browser - please use a more modern browser or manually enter an address.'
            );
            return;
        }
        // By calling setIsLoading, we use the useState provided function and that way the effect is shown on the DOM: reacted
        setIsLoading(true);
        navigator.geolocation.getCurrentPosition(
            async (successResult) => {
                const coordinates = {
                    lat: successResult.coords.latitude + Math.random() * 50,
                    lng: successResult.coords.longitude + Math.random() * 50,
                };
                const address = await getAddressFromCoords(coordinates);
                setChosenCoords(coordinates);
                setChosenAddress(address);
                setIsLoading(false);
            },
            (error) => {
                setIsLoading(false);
                alert(
                    'Could not locate you unfortunately. Please enter an address manually!'
                );
            }
        );
    };

    const sharePlaceHandler = () => {
        if (!navigator.clipboard) {
            shareLinkRef.current.select();
            return;
        }

        navigator.clipboard
            .writeText(sharableLink)
            .then(() => {
                alert('Copied into clipboard!');
            })
            .catch((err) => {
                console.log(err);
                shareLinkRef.current.select();
            });
    };

    // We can see the returned value is not JS but instead JSX, which resembles HTML closely
    // This can be used to form the html content of the page by leaving the html empty at the start
    return (
        <React.Fragment>
            {isLoading && (
                // In this line we simply use the && trick to only load if isLoading is true
                <Modal>
                    <div className="modal__content centered">
                        <div className="lds-dual-ring"></div>
                    </div>
                </Modal>
            )}

            <Header title="Share a Place" />

            <SelectedPlace
                // We're sending attributes that don't exist for normal html here, this way we can pass arguments to components
                fallbackText="You haven't selected any place yet. Please enter an address or
            locate yourself!"
                centerCoords={chosenCoords}
            />

            <section id="share-controls">
                <input
                    ref={shareLinkRef}
                    value={sharableLink}
                    type="text"
                    readOnly
                    placeholder="Select a place to get a sharable link."
                />
                <button disabled={!sharableLink} onClick={sharePlaceHandler}>
                    Share Place
                </button>
            </section>

            <section id="place-data">
                <form onSubmit={pickAddressHandler}>
                    <label htmlFor="address">Address</label>
                    <input type="text" id="address" ref={addressInputRef} />
                    <button type="submit">Find Place</button>
                </form>
                <button onClick={getUserLocationHandler}>
                    Get Current Location
                </button>
            </section>
        </React.Fragment>
    );
};

export default SharePlace;
