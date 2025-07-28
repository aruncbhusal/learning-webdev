// In this setup we are given some files with prewritten code and I need to now add more
// First we install all the packages in packages.json which is basically only webpack
// To get started with testing, we need to know the tooling we use for it:
// 1. Test Runner: Executes the tests and summarizes results. Eg. Mocha
// 2. Assertion Library: Defines testing logic and conditions. Eg. Chai
// 3. Headless Browser: simulate a browser interaction Eg. Puppeteer
// In this case we use a Test Runner + Assertion Library called Jest, which we can find at https://jestjs.io/
// We can read the docs to install it, using npm install --save-dev jest

// This function and the validateInput function were exported here directly but since we need them here
// We need to assign to normal constatnts, because they become a part of the exports object if we do exports.generateText
const generateText = (name, age) => {
    // Returns output text
    return `${name} (${age} years old)`;
    // This function is a ripe fruit for unit testing here, since it is a single function that gives out an output
    // We can write the test code in another file, we can create util.test.js, and it is auto recognized
};

exports.createElement = (type, text, className) => {
    // Creates a new HTML element and returns it
    const newElement = document.createElement(type);
    newElement.classList.add(className);
    newElement.textContent = text;
    return newElement;
};

const validateInput = (text, notEmpty, isNumber) => {
    // Validate user input with two pre-defined rules
    if (!text) {
        return false;
    }
    if (notEmpty && text.trim().length === 0) {
        return false;
    }
    if (isNumber && +text === NaN) {
        return false;
    }
    return true;
};

exports.validateAndGenerate = (name, age) => {
    if (!validateInput(name, true, false) || !validateInput(age, false, true)) {
        return false;
    }

    const outputText = generateText(name, age);
    return outputText;
};

exports.generateText = generateText;
exports.validateInput = validateInput;
