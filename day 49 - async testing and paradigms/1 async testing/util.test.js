// The problem with testing the print function is that it has asynchronous code so it doesn't simply return the value to us
// One solution is to test the loadTitle function instead since it returns something for which we can use expect
jest.mock('./http');

const { loadTitle } = require('./util');

test('should output upper case string', () => {
    loadTitle().then((result) => {
        expect(result).toBe('DELECTUS AUT AUTEM');
    });
});
// Even though this works, this is a problem, because we're making a HTTP request, hitting an API, during a test
// We should test API endpoints during backend development and not in frontend, in front end we deal more with what happens with data
// like, the loadTitle function takes an object whose title property is made uppercase and returned, we should be testing that instead
// Plus, we're using axios to fetch data inside the fetchData function called in loadTitle, which means we're testing a 3rd party library
// This is unnecessary, so we can instead make use of "mocks" in order to test better
// We rely on the fetchData function from http.js, we can create a folder called __mocks__ which is auto detected by jest
// We can then create a new http.js there which simply returns a promise similar to what original http.js would
// We can then let jest know which file is to be brought in from mocks by using jest.mock(filename) on top of this file

// We can also instead create an axios.js file which simulates the response of axios http request call used in fetchData function
// We don't need to set up jest.mock for global node modules

// There are also other ways to deal with async code: https://www.harrymt.com/blog/2018/04/11/stubs-spies-and-mocks-in-js.html
// We can read the Jest docs to figure out more: https://jestjs.io/docs/getting-started
