// Programming paradigms are just ways of writing/organizing code. They are not syntax or tools but a pattern followed
// There are mainly three paradigms:
// 1. Object Oriented Progrmaming: Data and logic organized in objects i.e. properties and methods, components separaed with their own logic
// 2. Procedural Programming: sequential step by step code execution from top to bottom
// 3. Functional Programming: pass around parameters and organize code in blocks of pure functions, each with clearly defined tasks

// We will first work with the index.html file which contains a login form, using a procedural approach
// We need to get a hold of the inputs and validate it, then if valid, we simply log it out
const form = document.getElementById('user-input');

// Just because we're working with a procedural paradigm doesn't mean we can't use functions or objects
// It is about how the code is organized, rather than what is used
function submitHandler(event) {
    // First we need to prevent default behavior of the browser
    event.preventDefault();

    // Now we can get hold of the input fields and validate them
    const usernameEl = document.getElementById('username');
    const username = usernameEl.value;

    const passwordEl = document.getElementById('password');
    const password = passwordEl.value;

    if (username.trim().length === 0) {
        alert("The username can't be empty.");
        return;
    }
    if (password.trim().length < 6) {
        alert('Password must be at least 6 characers long');
    }

    const user = {
        username: username,
        password: password,
    };
    console.log(user);
    console.log(`Hi I am ${username}`);
}

// We need to add event listener to the form
form.addEventListener('submit', submitHandler);

// Already late today so the other paradigms will have to wait until tomorrow
