// In this file we need to first import the function to test, and we need to use NodeJS imports here instead of ES6
// (At least at the time of the course being recorded)
const { groupEnd } = require('console');
const { generateText, validateAndGenerate } = require('./util.js');
const puppeteer = require('puppeteer');

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

// Now for integration testing, we will call the validateAndGenerate function
// We can see that the function contains generateText as well, which means we need to verify that works, for which we have the unit test
// So we should do unit tests and then verify they work together with integration tests
test('Should return valid text output', () => {
    const result = validateAndGenerate('Cynthia', 55);
    expect(result).toBe('Cynthia (55 years old)');
});

// For UI test we need to first install a package called puppeteer which simulates a browser for us, and can open the browser and automate
// With it imported, we can now create the test case for E2E
test('Should create a user with valid class', async () => {
    // Since browser actions are asynchronous, we need to have this function as async
    const browser = await puppeteer.launch({
        // Here we can give different options, headless: true doesn't launch the browser, but we can look with headless: false
        headless: false,
        // We can also slow down the actions so that we can see what is happening
        sloMo: 80,
        // We can set a custom resolution using args for the browser window so that we can also test responsiveness
        args: ['--window-size=1920,1080'],
    });
    // Now in this browser we can open a new page that loads our index
    const page = await browser.newPage();
    await page.goto(
        'file:///D:/learning-webdev/day%2048%20-%20intro%20to%20testing/1%20testing/index.html'
    );
    // Since we're not running a server even with webpack, we can directly do it from the file system

    // Next we need to interact with the browser page, and we can use functions like click and type which take selector as argument
    await page.click('input#name');
    await page.type('input#name', 'Marcus');
    await page.click('input#age');
    await page.type('input#age', '28');
    await page.click('#btnAddUser');

    // After all is filled anad submitted, next our job is to check for an element, for which we can use $eval which is basically selector
    const finalText = await page.$eval('.user-item', (el) => el.textContent);
    // I was confused about its behavior and asked GPT, which said that $ can be used for selector but $eval WAITS for the element if not present

    // This lets us validate that the result is appended to the DOM and it has the appropriate class
    // The second argument takes a callback to which the element from the first argument is passed
    // Finally we can expect a matching value here
    expect(finalText).toBe('Marcus (28 years old)');
}, 10000);
// This also takes a third argument that specifies the total time before which the test must be completed (in ms)
