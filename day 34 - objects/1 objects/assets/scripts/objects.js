// The first thing we need to do here is to allow the user enter the movie name and an info whose name user enters themselves
// We can then use these to create a new object which we store in a list for movies
// let's set up the buttons first
const addMovieBtn = document.getElementById('add-movie-btn');
const searchBtn = document.getElementById('search-btn');

// The movie array
const movies = [];

// Now let's set up a handler function for the addMovieBtn
const addMovieHandler = function () {
    // console.log(this);
    // The 'this' keyword for a function called by an eventListener looks liek global context but since we didn't call it ourselves,
    // It is bound by the browser to the event/element that triggered the event
    // In this case it might return the add button element
    // But this is applicable for normal functions, not arrow functions

    // We need to select the input fields and take their value
    const title = document.getElementById('title').value;
    const extraName = document.getElementById('extra-name').value;
    const extraValue = document.getElementById('extra-value').value;

    // if any input is invalid we don't move forward
    if (
        title.trim() === '' ||
        extraName.trim() === '' ||
        extraValue.trim() === ''
    ) {
        return;
    }

    // Now we can set up the object
    const newMovie = {
        info: {
            title, // When title: title, we can simply write title
            [extraName]: extraValue,
        },
        id: Math.random(), // We'll use a random value again
        getFormattedTitle() {
            // We can omit the ': function' part here and use the shorthand instead
            // An arrow function treats 'this' differently so we should not use it while using 'this' keyword

            // The 'this' keyword is used to access whatever is responsible for executing the function
            // Here inside this object, the object itself is responsible so it can be accessed using this
            // Without a this keyword, we can't access this object's properties here directly with their name
            return this.info.title.toUpperCase();
            // Now we can use this instead of the movie title in the display logic below
        },
    };

    movies.push(newMovie);
    // console.log(movies);

    renderMovies();
};

// Now we need to add the event handler to the button
addMovieBtn.addEventListener('click', addMovieHandler);

// We also need to have a function that updates the movie element
const renderMovies = (filter = '') => {
    const moviesList = document.getElementById('movie-list');

    if (movies.length === 0) {
        // If there are no elements, let's remove any class called 'visible'
        moviesList.classList.remove('visible');
        return;
    } else {
        moviesList.classList.add('visible');
    }

    // We can append tot he list each time new movie is added. But let's make it so it resets the list and adds all at the same time
    moviesList.innerHTML = '';

    // In order to add the filter functionality, we need to create a new array that has only the items we want
    const filteredMovies = !filter
        ? movies
        : movies.filter((movie) => movie.info.title.includes(filter));
    // if the filter is '' i.e. !filter is true then it simply returns the movies array, else it returns a filtered array

    // Now we'll move through all elements one at a time and create a list item element that has the info
    filteredMovies.forEach((movie) => {
        const movieElement = document.createElement('li');
        // newItem.textContent = movie.info.title;
        // We need to access the title and the other keys(key) apart from title so that we can display it as well
        // But since we don't know the name of they key we need to use the dynamic method
        //                      let text = movie.info.title + ' - ';
        // Here we have used a concept called chaining, where we take the output of an expression and use it directly without storing
        // We could store movie.info into a variable then use that variable .title, but we can use them together
        // In fact we can also use them on methods, taking their return values and using its property or method
        // For example the toString() method is available to almost all JavaScript entities.
        // let text = movie.getFormattedTitle() + ' - ';

        // The above line works well, but if we use a destructuring to get only the formatted title, it will throw an error
        // Since we're calling the method from a global context, 'this' inside the function(method) becomes the window
        // In a strict mode environment, this is undefined. So in order to work with it, we can bind a context to this
        let { getFormattedTitle } = movie;
        // We can bind 'this' inside getFormattedTitle to become movie by using the bind method
        // We can also bind while destructuring, but here we'll do it afterwards
        // getFormattedTitle = getFormattedTitle.bind(movie);
        // let text = getFormattedTitle() + ' - ';

        // Instead of using bind which prepares a function for later execution, we can use call or apply methods
        // They are used to immediately call a function, their first parameter is the 'this' context
        // call takes multiple parameters afterwards, consisting of the parameters to be passed while calling the function
        // apply takes an array as a second parameter, which contains all the parameters to be passed while calling the function
        let text = getFormattedTitle.call(movie) + ' - ';
        // Using call or apply here is personal choice

        // We can use the for...in syntax to loop through all the keys of an object, we can use it here as well
        for (key in movie.info) {
            if (key !== 'title') {
                // Since keys are stored as strings, we need to check it this way
                // We want to add any key-value pair that is not the title into the text variable
                text = text + `${key}: ${movie.info[key]}`;
            }
        }
        // Now we can add this into the textContent property
        movieElement.textContent = text;

        // Finally we append the item into the movie List element
        moviesList.append(movieElement);
    });
};

// Now we need to add the filter functionality
const searchButtonHandler = () => {
    // console.log(this);
    // In arrow functions, the this keyword returns to whatever the context is outside of the function
    // So using a this keyword here would return the Window, because that is what is outside of this function
    // If we log 'this' anywhere on the global scope, the result would be the same as here
    // Arrow functions don't know about their own 'this' so they borrow one from outside the function

    // This will take the input in the filter field and pass it to the renderMovies function
    // the function currenetly has no input, but we can add an input with a default parameter so that we don't need to change the other
    const filterTerm = document.getElementById('filter-title').value;

    // We don't need to do any checks here, because if the item doesn't exist it will just show up empty
    renderMovies(filterTerm);
};

// Let's also add the event handler to the filter button
searchBtn.addEventListener('click', searchButtonHandler);
