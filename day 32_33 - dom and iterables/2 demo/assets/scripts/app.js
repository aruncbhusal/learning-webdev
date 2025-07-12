/* Finally this time we have some: "do it yourself then continue watching" moments
The starting html and css is already given, our job is to be able to add movies and be able to show them
The first thing we need to do is display the modal when the "Add Movie" button is pressed
This modal would allow the user to type the movie name. We can do it simply by adding the 'visible' class already given in css */

// List of movies
const movies = [];

// Let's first select the button
const addMovieButton = document.querySelector('header button');
// We also need to select the modal, which is already in the DOM since it is hidden only by the css with display: none
const movieModal = document.getElementById('add-modal');
// Now we can add an event listener that listens to clicks on the button
// We could use something like document.body.children[1] or something for modal, and querySelector('header').lastElementChild
// But selecting by id and specific selector makes it tolerate changes to structure, as well as have better performance

// addMovieButton.addEventListener('click', () => {
//     modal.classList.add('visible');
// });

// we might need to reuse this function so let us create a function to toggle the modal instead of just adding
// function toggleMovieModalVisibility() {
//     movieModal.classList.toggle('visible');
//     // We cal also call the toggleBackdrop here since when the modal is visible, we also want the backdrop to be
//     toggleBackdrop();
// }

// Since we have to deal with delete modal as well, and clicking on backdrop should close, not toggle, we need new functions
// These functions will not toggle but instead either show or close
function showMovieModal() {
    movieModal.classList.add('visible');
    // We cal also call the toggleBackdrop here since when the modal is visible, we also want the backdrop to be
    toggleBackdrop();
}
function closeMovieModal() {
    movieModal.classList.remove('visible');
    // Removed the toggleBackdrop call to be added each time this is called instead, because this might break the toggling later
}

addMovieButton.addEventListener('click', showMovieModal);

// Similarly we also need to ensure the backdrop is active since right now it doesn't look like a modal
// We already have the required HTML and CSS given so we can simply add the visible class to backdrop as well
const backdrop = document.getElementById('backdrop');
function toggleBackdrop() {
    backdrop.classList.toggle('visible');
}

// Now that the backdrop is there, we need to make the cancel button work, which would close the modal and the backdrop
// We should also ensure that clicking anywhere on the backdrop would toggle the modal as well
const cancelBtn = document
    .getElementById('add-modal')
    .querySelector('.modal__actions').firstElementChild;
// There must surely be a better way of doing this? I could also do lastElementChild.firstElementChild obviously
// In the course, the btn-passive class was used since this button was the first one with that class

// Now let's add an event listener
// backdrop.addEventListener('click', toggleModalVisibility);
// But I might not want to always toggle movie modal when I click backdrop, we can have some other modal as well
// So let's create a function for this case
function backdropClickHandler() {
    // Let's call the same function here for now
    closeMovieModal();
    // Clear any inputs
    clearAddMovieInputs();

    // We need to close the delete modal if open as well
    closeDeleteMovieModal();

    // And since we only want to toggle backdrop once, we add the call here
    toggleBackdrop();
}
backdrop.addEventListener('click', backdropClickHandler);

const cancelBtnHandler = () => {
    closeMovieModal();
    toggleBackdrop();
    // Let's also clear any input that was added:
    clearAddMovieInputs();
};
cancelBtn.addEventListener('click', cancelBtnHandler);

// Now we need to handle the add movie button. Let's first selec it
const addMovieBtn = cancelBtn.nextElementSibling;
// Similarly to add the movie, we need to get all the values in the input fields
const userInputs = movieModal.querySelectorAll('input');
// We can also use the getElementsByTagName here instead

// we can now define a handler for the add button
const addMovieHandler = () => {
    // Now we can select elements from the userInputs NodeList
    const titleValue = userInputs[0].value;
    const imgUrlValue = userInputs[1].value;
    const ratingValue = userInputs[2].value;

    // Now we need to check condition for invalid inputs (empty) or rating not between 1 and 5.
    // For invalid inputs we can use .trim() which removes all leading and trailing whitespaces of a string
    if (
        titleValue.trim() === '' ||
        imgUrlValue.trim() === '' ||
        ratingValue.trim() === '' ||
        +ratingValue < 1 ||
        +ratingValue > 5
    ) {
        // We can use either parseInt to get the number from the rating field, or we can simply use + to convert
        // In comparisons like this, normally the value is already coerced by JS
        alert('Please enter valid values (rating from 1 to 5)');
        return;
    }

    // Now we need to store the movies so let's create an array above, and create a movie object which stored movie info here
    const newMovie = {
        // Let's also add an id, for this time we can simply use a random number, not necessarily unique but it works for now
        id: Math.random().toString(),
        title: titleValue,
        imgUrl: imgUrlValue,
        rating: ratingValue,
    };

    movies.push(newMovie);
    console.log(movies);
    closeMovieModal();
    toggleBackdrop();
    clearAddMovieInputs();

    // We also need to render the new movie element and update the UI
    renderNewMovieElement(newMovie);
    updateUI();
};

// We also need to ensure the input fields are cleared when the add or cancel actions happen. Let's have a new function
const clearAddMovieInputs = () => {
    for (const usrInput of userInputs) {
        usrInput.value = '';
    }
};

// Let's add the handler to the add button
addMovieBtn.addEventListener('click', addMovieHandler);

// Now we need to be able to add the movies. Let's create a function that removes the initial section for an empty list
// First, we need to select the section
const initialSection = document.getElementById('entry-text');
const updateUI = () => {
    if (movies.length === 0) {
        initialSection.style.display = 'block';
    } else {
        initialSection.style.display = 'none';
    }
};

// Now we need to actually add the movie element. Let's get the parent element for the movie list
const movieListParent = document.getElementById('movie-list');
const renderNewMovieElement = (movie) => {
    // In the course all metadata about the movie was passed, but I chose to pass the object instead.
    // Now we can create a new list item element and style it according to the css and how it was intended
    const newMovieElement = document.createElement('li');
    newMovieElement.className = 'movie-element';
    newMovieElement.innerHTML = `
    <div class="movie-element__image">
        <img src="${movie.imgUrl}" alt="${movie.title}">
    </div>
    <div class="movie-element__info">
            <h2>${movie.title}</h2>
            <p>${movie.rating}/5 stars</p>
    </div>
    `;
    console.log(newMovieElement.innerHTML);
    // Finally we need to append it
    movieListParent.append(newMovieElement);

    // Let's add a delete event handler to this new element, but we need to send the id so we bind it
    newMovieElement.addEventListener(
        'click',
        deleteMovieHandler.bind(null, movie.id)
    );
    // When the element is deleted, JS clears everything associated with it, along with any event handlers
    // So this doesn't create a memory leak
};

// Now we need to add an ability to delete a movie as well, so let's create a function that handles the deletion
const deleteMovie = (movieId) => {
    // Since we need to know which movie to delete, we also need to embed an id with the movie to be stored
    // With this id, we can now look for it throughout the movies array to find the index of the one that matches
    // Since the movies are shown in the order of their index in the array, that makes it easier for us to locate the one
    let movieIndex = 0;
    for (const movie of movies) {
        if (movie.id === movieId) {
            // I thought it was breaking us out of the if block only, but seems like I was just dumb, using for...in instead of for...of
            break;
            // This will break us out of the loop when we find the index of the movie we want
        }
        movieIndex++;
    }
    // We can now remove the movie from the array using the splice function, which takes the starting index and number of items
    movies.splice(movieIndex, 1);
    // Now similarly we alos need to remove the element from the UI, so let's locate it
    movieListParent.children[movieIndex].remove();
    // Or we can use the older method of movieListParent.removeChild(movieListParent.children[movieIndex]);

    // After deletion is complete, we also need to close the modal
    closeDeleteMovieModal();
    toggleBackdrop();
    // we can also update the UI (if there's none left)
    updateUI();
};

// Sicne we need to ask for confirmation when the user clicks to delete, we need to change the above handler to delete action
// And create a new handler which first shows the modal before handling the actual deletion
const deleteMovieModal = document.getElementById('delete-modal');
const deleteMovieHandler = (movieId) => {
    showDeleteMovieModal();

    // Now we need to handle the buttons in the modal
    const cancelDeletionBtn = deleteMovieModal.querySelector('.btn--passive');
    let confirmDeletionBtn = deleteMovieModal.querySelector('.btn--danger');

    // Since we add event listeners here, every time we open the model we also add new event listeners
    // This will not only create memory leaks since the buttons are still there, they will also break the code
    // Since we add multiple deleteMovie bindings to the same element, it will try to send the movieId multiple times
    // But since the movie will already be deleted, it will throw a ReferenceError saying undefined
    // So each time we call this function, we need to remove event listeners, which is simple for cancel button
    cancelDeletionBtn.removeEventListener('click', cancelDeleteBtnHandler);
    // But it's not so simple for confirmDeleteBtn because we bind the movieId.
    // We can't be sure that the movieId for this call will be the same as next call. So instead we need to do a trick
    // We can replace the delete button with a clone (which will have a different reference)
    // Then by making confirmDeleteBtn a variable, we can use it to select the new clone confirm Btn
    confirmDeletionBtn.replaceWith(confirmDeletionBtn.cloneNode(true));
    confirmDeletionBtn = deleteMovieModal.querySelector('.btn--danger');

    // Now we need to add event listeners to these
    cancelDeletionBtn.addEventListener('click', cancelDeleteBtnHandler);
    confirmDeletionBtn.addEventListener(
        'click',
        deleteMovie.bind(null, movieId)
    );
    // me not adding null as a parameter here took my 20 mins away
    // deleteMovie(movieId);
};

// We need two new functions that will open and close the delete modal
const showDeleteMovieModal = () => {
    deleteMovieModal.classList.add('visible');
    toggleBackdrop();
};
const closeDeleteMovieModal = () => {
    deleteMovieModal.classList.remove('visible');
};
// Let's also handle the cancel button clicked condiiton
const cancelDeleteBtnHandler = () => {
    closeDeleteMovieModal();
    toggleBackdrop();
};
