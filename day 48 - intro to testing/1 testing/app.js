// Testing is done for code with an expected result, when we perform a test we compare the expected result to observed result
// If they are the same then the test was successful and we can move ahead, else if it fails we need to modify the code to make it succeed
// We can automate the actual testing part of this pipeline. We need to test for the following purposes:
// 1. Get an error if we break some code
// 2. Save time debugging and spend it on more important stuff
// 3. Think about possible issues and bugs
// 4. Integrate into build workflow, like we might want to automate commit, deploy, etc
// 5. Break up complex dependencies
// 6. Improve our code and ensure it produces correct outpurs

// There are different kinds of tests
// 1. Unit testing: Testing a part of the code fully isolated from the rest, like a function
// 2. Integration testing: Testing code with dependencies, which might bring more constraints
// 3. User Interface/End-to-End Testing: Testing the entire code at once: Full Flow
// As we include more and more parts of the code, complexity increases further
// And as complexity increases, we should also write less test codes. Unit testing should have highest number of testings

const { generateText, createElement, validateInput } = require('./util');

const initApp = () => {
    // Initializes the app, registers the button click listener
    const newUserButton = document.querySelector('#btnAddUser');
    newUserButton.addEventListener('click', addUser);
};

const addUser = () => {
    // Fetches the user input, creates a new HTML element based on it
    // and appends the element to the DOM
    const newUserNameInput = document.querySelector('input#name');
    const newUserAgeInput = document.querySelector('input#age');

    if (
        !validateInput(newUserNameInput.value, true, false) ||
        !validateInput(newUserAgeInput.value, false, true)
    ) {
        return;
    }

    const userList = document.querySelector('.user-list');
    const outputText = generateText(
        newUserNameInput.value,
        newUserAgeInput.value
    );
    const element = createElement('li', outputText, 'user-item');
    userList.appendChild(element);
};

// Start the app!
initApp();
