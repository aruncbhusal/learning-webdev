// In this file we need to first import the function to test, and we need to use NodeJS imports here instead of ES6
// (At least at the time of the course being recorded)
const { groupEnd } = require('console');
const { generateText } = require('./util.js');

// In ordder to write a test case we can use the test function which takes two arguments, a description, and the testing callback:
test('Should output name and age in specific format', () => {
    // Here we use the expect function to set an expected output and test our observed output against it
    // We also need to update the package.json file so that test script uses jest
    const result = generateText('Ella', 28);
    expect(result).toBe('Ella (28 years old)');

    // Then we can run the test to see if it goes smoothly. We can add another test case here as well, or add more expects inside this function
    const result2 = generateText();
    // In case of empty inputs, the comparison can be done as:
    expect(result2).toBe('undefined (undefined years old)');
});

// Almost midnight already, I think I'll do the rest tomorrow morning. Doing a lot less these days but sleep is important
