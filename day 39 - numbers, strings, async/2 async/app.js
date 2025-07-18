// JavaScript is single threaded i.e. only one execution takes place at a time. The code runs one line after another
// It means that in the following code, the button is first selected, then only later the event listener is added

// But we can also have asynchronous behavior by using the browser. Sometimes we may want to not wait for something that takes a long time
// Like setting a timer or making a HTTP request, in such cases we need to ensure the rest of the code runs while that is handled in the background
// In such cases, the functions like setTimeout are delegated to the browser so even though JS only takes a single thread, the browser handles
// the timing, and calls the callback function after the timer has passed, or the response has arrived (in case of HTTP request)

const button = document.querySelector('button');
const output = document.querySelector('p');

// Another function that promisifies the getCurrentLocation function
function getLocation(opts) {
    const promise = new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            (success) => {
                resolve(success);
                // We want to resolve the promise with the location if the getting process was a success
            },
            (error) => {
                // We might also need to handle cases where the promise doesn't get resolved
                // There are the states of a promise: pending, resolved or rejected
                // Here we can use the error method to pass the error, which disrupts the flow of .then methods after the error is found
                reject(error);
            },
            opts
        );
    });
    return promise;
}

// Let's create the function that can be used with a promise
// Promises are objects which wrap the asynchronous code inside a callback which helps us handle them better
function setTimer(ms) {
    // Inside this function we need to create a new Promise object using the constructor, and it takes two arguments: resolve and reject
    const promise = new Promise((resolve, reject) => {
        // Inside this callback, we can execute the asynchronous code
        // In this case, we want to resolve the promise when the setTimeout timer expires
        setTimeout(() => {
            // We can resolve the promise here
            resolve('Done!');
        }, ms);
    });
    // Finally we also need to return the promise response
    return promise;
}

function trackUserHandler() {
    // console.log('Clicked!');
    /*
    navigator.geolocation.getCurrentPosition(
        (success) => {
            // We can also nest callbacks but it gets harder to understand each time
            // We can log the success data inside a setTimeout callback, which is inside a getCurrentPosition callback inside a click event callback
            // setTimeout(() => {
            //     console.log(success);
            // }, 2000);
            // Similar thing happens here as well, it too is added again to the message queue from where the event listener pushes to call stack
            // All this happens after the timer expires in the browser

            // But nesting callbacks like this makes the cood less readable and less maintainable
            // So we instead prefer to use promises and .then which lets us chain a single layer of callbacks rather than multiple nested layers
            // Since old built in functions don't support promises which are a relatively new construct, we can "promisify built in functions"
            // by creating our own function that wraps the built in asynchronous function
            setTimer(2000).then((resolved) => {
                console.log(resolved, success);
            });
            // Here the promise is first resolved by setTimer, then the resolved promise is passed to callback inside .then
            // it then logs out the value which was passed to the resolve function, and the success message of the getCurrentPosition method
        },
        (error) => {
            console.log(error);
        }
    );
    */

    // Similarly, we can also promisify the entire getCurrentLocation method, let's create another function that returns a promise
    let location;
    getLocation()
        .then((locationData) => {
            // We could use setTimer here and use .then with it to handle this locationData promise but that again becomes "callback hell"
            // Since we have the ability to chain promises we can do it easily by returning a function call, if we call setTimer it returns a promise
            // Then the next .then will catch the response of this .then
            location = locationData;
            return setTimer(2000);
            // We don't NEED to return a promise here, it can be any kind of data that can be used inside the next .then
        })
        // We can add a second argument to .then with the error argument so that we can handle the errors until that point
        // We can instead also use a catch() method similar to .then method to catch any such errors until the point
        // If we add a catch after 5 .then , if an error was found anywhere in the 5 .then's, the rest would be skipped until catch
        // After the catch function returns either a value, or nothing(undefined), the promise changes from error to pending again
        // And it goes through the remaining .then methods. These methods can be used for error handling with strategic placement
        .catch((error) => {
            console.log(error);
            return 'Completed with error...';
        })
        .then((response) => {
            console.log(response, location);
            // Since location is declared outside the lexical environment here, it can be accessed by both callbacks and hence shared
        });
    // After there are no more .then's, it enters a mode called "settled". Once settled, we can run a .finally() block
    // It is executed regardless of whether our promise chain resolved or was rejected
    // Adding .finally() is not necessary in most cases
    // This is called promise chaining

    // This geolocation method has multiple parameters, two callbacks for success and error, and one for options
    // In this case we're passing the success and error parameters, and like the button click, this too is asynchronous
    // which means it is registered to the browser that we need to get the location, then after the location is retrieved/error occurs
    // The respective callback is executed. And this may either take time or be instantaneous

    setTimeout(() => {
        console.log('Still fetching...');
    }, 0);
    // We can see that this code runs after the code below, even though we have set the timer to 0. This is because JS is non blocking
    // which means since this is an asynchronous task, it will get delegated to the browser and the synchronous call stack is run
    // Then only after call stack is empty is it executed

    console.log('Fetching location...');
    // In either case the above log will run before the callbacks since the getting current position is handled by the browser
    // And after some handling, the resulting code is pushed to the message queue, from which the event loop moves it to the call stack
    // but the call stack already has the logging function so it executes the log first before the callback is added to the call stack
}

// button.addEventListener('click', trackUserHandler);

// let i;
// for (i = 0; i < 100000000; i++) {
//   i = i + 1;
// }
// console.log(i);
// When we run the code, this for loop has many iterations so it will take some time to finish before the logging happens
// But when the loop is being executed, we might click on the button, or have any other code after it, like the logging here
// It doesn't get executed because the loop is being run by JavaScript and it blocks the code after it to only run after it is done
// In case of the button, even if we click it while the loop is running, it happens only after the loop is done and output is logged
// This is because JavaScript uses something called the event loop which is present in the browser/ JS environment

// When the code is being run, it adds the code it discovers to the call stack, and all code is bundled into a macro task (as per GPT)
// The listener is registered on the browser which keeps listening for events/timers and when an event occurs/timer expires,
// the browser API updates a message queue/event queue where the code to be executed (callback) is placed. Once the call stack (macro task)
// is cleared and empty, then the event in the message queue is pushed to the call stack using the event loop, where it is executed

// Instead of using the normal promise chaining, we can use a modern javascript solution called async/await
// When we have a function created using the async keyword, right after funciton name (expression functions) /function keyword (normal)
// It automatically becomes a function that returns a promise, normal function would return void
async function tracker() {
    // Inside this function, we can use the await keyword in front of an expression in order to wait for it before the next line

    // Since the code  here looks like synchronous code, we can use similar error handling to mimic the catch block, using try...catch
    let posData;
    let timerData;
    try {
        posData = await getLocation();
        timerData = await setTimer(2000);
    } catch (error) {
        console.log(error);
    }
    // It looks like we're changing how javascript is working by making it asynchronous, but this is just syntactic sugar for promise chaining
    // We're still working with promises, since getLocation and setTimer return promises, which when resolved get stored in posData/timerData
    // Now we can replicate the behavior inside the trackUserHandler by simply logging the values
    console.log(timerData, posData);
    // This logging code will always run regardless of whether the code will resolve or get rejected
}

// Async/await vs raw Promises
// Though async/await makes the code look elegant, it has some downsides. First is that inside an async function, everything runs synchronously
// We can't be running an await and also a later appearing timeout method at the same time. For that we would need to create diff functions
// Another downside is that it can only be done inside functions (except we can do it on global scope on certain environments)
// So in order to use an async function in a normal system, we can use IIFE to wrap the code into a function and make it execute then and there

button.addEventListener('click', tracker);

// Sometimes we may want the promise to behave in different ways, and the Promise class has prototype methods to handle them
// We can use the race() method and pass in an array some functions that resolve, and it returns the value from whichever resolves first
Promise.race([getLocation(), setTimer(2000)]).then((data) => {
    // It also returns the faster promise, which can be accessed using .then here
    console.log(data);
});

// We also have method by which we can wait for all promises to resolve/reject before we can go to .then
// In that case, it returns nothing but the error
Promise.all([getLocation(), setTimer(2000)]).then((data) => console.log(data));

// Similarly, a function which resolves even if only as least one is resolved, while other may be rejected
Promise.allSettled([getLocation(), setTimer(2000)]).then((data) =>
    console.log(data)
);

// Finally the module is completed, this is it for today
