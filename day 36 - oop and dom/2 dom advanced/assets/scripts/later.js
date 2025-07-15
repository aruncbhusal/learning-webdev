console.log('This was executed later in a different js file!');

// We can set an interval in the same way as a timeout
let i = 0;
const intervalId = setInterval(() => {
    i++;
    console.log(`This is the ${i} time the interval has passed.`);
}, 2000);
// Similarly, we can use the button to turn this off as well
document.getElementById('stop-script-loader').addEventListener('click', () => {
    clearInterval(intervalId);
    // We can also use clearTimeout to clear this interval, but using this is more intentional and descriptive
});

// We can also use the location and history objects and its different properties
// For example
console.log(location.href); // This gives us the location we're currently in. So if we set it to something else, we go to another page
// We can also use other properties like
console.log(location.origin);
console.log(location.host); // This gives us the host which is serving us the page, in this case it is localhost so it should be empty
console.log(location.pathname); // This property gives us the relative path from the website homepage to the current path
// We can use location.assign() to take a person to the website without being able to get back (from history)

// We also have different methods in the history object
// history.back() takes us back one page
// history.go(n) takes us back n number of pages
// history.forward() takes us forward, to the page we backed out from
console.log(history.length); // total length of the current history

// There also is the navigator object which comes with its own methods to navigate the browser and OS
console.log(navigator);
console.log(navigator.userAgent); // In the past it used to have what browser the user is using
// But since some browsers were blocked from using scripts, browser vendors started adding all browser names, essentially faking own browser
// We can read about it here: https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Browser_detection_using_the_user_agent
// Navigator also hahs other useful methods, like adding or reading from a user's clipboard using clipboard method inside navigator
// Also we can request location access and find the co ordinates of user (approx.) using geolocation
// navigator.geolocation.getCurrentPosition((data) => {
//     console.log(data);
// });
// https://developer.mozilla.org/en-US/docs/Web/API/Window/navigator#example_1_browser_detect_and_return_a_string

// We can also use the Date class to create date objects
const currentDate = new Date(); // This creates a new date object with a timestamp for current date
console.log(currentDate);
// we  can also create another date ourself by giving it a string and it will try to parse it into a valid date
const pastDate = new Date('2/3/2019');
console.log(pastDate);
// We can get the time from this date using getTime method
console.log(currentDate.getTime());
// SImilarly we can find the difference between two dates in milliseconds using a normal difference
console.log(currentDate - pastDate);
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date

// The error object is very important in error handling because it allows us to not only set message, but also other properties
// It also has a stack trace for where the error occured and why, which we can specify when creating our own error objects
const newError = new Error('Something went wrong');
// We can throw this error, as well as anything else can be thrown, but this is meant to be thrown
// But we also have other properties like
newError.code = 404;
// We can see the different properties and methods in this object using dir
console.dir(newError);
// Finally let's throw the error to wrap this up
throw newError;
