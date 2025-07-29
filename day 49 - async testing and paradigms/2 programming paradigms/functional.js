// OOP and Procedural are more intuitive approaches because in OOP we model after real world stuff
// Procedural is simpler to reason about being sequential in nature, we only have to think of an algorithm
// In functional paradigm we need to focus instead on how we can block codes together and have them do distinct stuff

// First thing we need is to define a function to get the form
// We should always try to keep our forms pure, and take parameters instead of hardcoded values whenever applicable
// That way our functions are as reusable as possible. In this case we can use form id and handler function as parameters
const REQUIRED = 'REQUIRED';
const MIN_LENGTH = 'MIN_LENGTH';

function validate(value, flag, threshold) {
    // This we can simply copy from the object oriented file since we're doing the same thing again
    // OOP and functional paradigms are not that far apart
    if (flag === REQUIRED) {
        return value.trim().length > 0;
    }
    if (flag === MIN_LENGTH) {
        return value.trim().length > threshold;
    }
}

// Function to extract value from input fields
function inputValue(inputId) {
    const input = document.getElementById(inputId);
    return input.value;
}

function createUser(username, password) {
    // Again we can reuse the condition like before
    if (!validate(username, REQUIRED) || !validate(password, MIN_LENGTH, 5)) {
        // alert(
        //     'Username or password is incorrect. (Passwords must be longer than 5 characters.'
        // );
        // Since we're writing pure functions, we don't wan to influence anything outside of the function like alert or logging here
        // We can instead thhrow a new error to be handled in the calling function
        throw new Error(
            'Invalid Input - Username or password is incorrect. (Passwords must be longer than 5 characters.'
        );
    }
    // When input is valid, we can send the user object here
    return {
        username: username,
        password: password,
    };
}

function greet(user) {
    console.log('Hi I am ' + user.username);
}

// Let's define the handler
function signupHandler(event) {
    // We should do the sacred ritual of preventing default behavior first
    event.preventDefault();

    // Now instead of writing multiple lines to get value from input fields, we can convert that into a function and let it do the job
    const username = inputValue('username');
    const password = inputValue('password');

    // Now we need to validate the user input as well, so for that we create a new function
    // We can bundle the validate logic in a function that also creates the user
    // Since it returns an error for invalid inputs, we can wrap this in a try-catch block
    try {
        const newUser = createUser(username, password);
        // We can now log the user and call the greet function
        console.log(newUser);
        greet(newUser);
    } catch (err) {
        alert(err);
        // Sometimes we just can't avoid impure functions and that's okay
        return;
    }
}

// Now for the actual form connection function
function connectForm(formId, submitHandler) {
    const form = document.getElementById(formId);

    form.addEventListener('submit', submitHandler);
}
// We need to call the function for this to be executed
connectForm('user-input', signupHandler);
// This way even if we have multiple forms, we can handle them accordingly

// The paradigm we choose to use depends on the type of application we're building, its complexity, the language we're working with, etc
// No one approach is worse than others but we may benefit with ease in some cases when using one paradigm over other
// OOP and recently functional paradigms are being used extensively for mid to complex applications
// For simpler applications, procedural programming is still strong.
