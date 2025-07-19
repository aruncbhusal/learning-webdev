// Let's write our HTTP Request
// We need a server to send the request to. We can create our own server using Node.JS which allows us to run JS outside of the browser
// But for now we will be using an external server in https://jsonplaceholder.typicode.com/
// When we type a URL onto the browser it sends a GET request, by checking on the different links given there, we can see that we can send
// GET requests to the /posts path

// Let's first get the template element and element to insert into the HTML
let postList = document.querySelector('.posts'); // Selects the <ul>
const postTemplate = document.getElementById('single-post'); // Selects the <template>
// We need to also connect to the UI of the page to fetch and create posts
const form = document.querySelector('#new-post form');
const fetchBtn = document.querySelector('#available-posts button');

/*
// In order to make a GET request i.e. get the data that we saw in the browser, we need to create a XMLHttpRequest object
const xhr = new XMLHttpRequest();
// This creates the request object which is supported across all browsers, and can be used to send http requests
// But before sending it we need to set up the request, so we do it using the open() method
// it takes two arguments minimum, first being the request method, which in our case is "GET", and the endpoint URL
xhr.open('GET', 'https://jsonplaceholder.typicode.com/posts');

// Now in order to send the request we need to use the send() method
// xhr.send();
// On first glance it looks like nothing has happened, but if we look at the network tab while the page is loading, we can see posts
// We can click on it to see the headers, and see the preview of the data that was received as well
// But so far we haven't had a way to use this data in our webpage.

// In order to get the response, which we can see in Response in Network tab, we need to use an onload event
// But event handlers are not supported on all browsers, not the older ones so we need to use an actual onload event with a function assigned
// The response can be in any format that can allow the frontend and backend to communicate, we can use plaintext, html, xml or most used, json
// To parse json, we can set the response type to json
xhr.responseType = 'json';
// It is not always possible to do this however and in such cases we need to parse the JSON after response is received

// JSON (JavaScript Object Notation):
// It is similar to a JavaScript object, and can have arrays, objects, strings, but all its keys must be enclosed with double quotes
// No quotes or single quotes don't work. In the value, strings need double quotes, numbers and booleans shouldn't use quotes
// The whole JSON is wrapped in double quotes because JSON itself is a string, if we use typeof we will get "string"
// We are not limited to just objects while converting to json, we can also convert strings, numbers, booleans, arrays, etc using stringify

xhr.onload = function () {
    // Inside here, we the response can be received, which will be in JSON format
    const listOfPosts = xhr.response;
    // We need to parse this JSON into a normal JavaScript object, which is automatically done when responseType is set to json
    // But if we can't do that, we can use the JSON class's parse() method, conversely, the stringify() method is used for object to json
    // const listOfPosts = JSON.parse(xhr.response);

    // Since this is run asynchronously, we need to handle the DOM manipulation and insert each post using the template
    for (post of listOfPosts) {
        const postElem = document.importNode(postTemplate.content, true);
        postElem.querySelector('h2').textContent = post.title;
        postElem.querySelector('p').textContent = post.body;
        postList.append(postElem);
    }
};

// Finally after the function is set, we can send the request
xhr.send();
*/

// But this isn't the only operation possible, so let's wrap this inside a function, and we can also promisify it
// So that the response of the request is sent back when the promise is resolved
/*
function sendHttpRequest(method, url, data) {
    const promise = new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        // We can also pass headers here using setRequestHeader
        xhr.setRequestHeader('Content-Type', 'application/json');
        // The key value pairs are written as two parameters, to add more headers we can simply call this method again
        xhr.open(method, url);
        xhr.responseType = 'json';

        xhr.onload = function () {
            // The request is only successful if the response status code is between 200 and 300
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(xhr.response);
            } else {
                reject(new Error('Something went wrong'));
            }
        };

        // We can also use the onerror method to handle errors
        // But it can only handle errors in which the error is due to the network, when the request can't be sent
        // But in case of a response from the server, even if it's an error it must be handled in onload
        xhr.onerror = function () {
            // console.log(xhr.response);
            // console.log(xhr.status);
            reject(new Error('There was an error making the request.'));
        };

        // Here simply sending nothing, or null works for get requests, but for post, we should also include the data
        xhr.send(JSON.stringify(data));
        // By using this, we allow passing a JS object which will be converted to JSON before sending to the server
    });
    return promise;
}
*/

async function fetchPosts() {
    // here we can use async/await or .then chaining

    // Since we're adding error handling, the reject() are treated as exceptions, so we need a try...catch block
    try {
        const responseData = await sendHttpRequest(
            'GET',
            'https://jsonplaceholder.typicode.com/posts'
        );
        const listOfPosts = responseData;

        // In the course, this function always appends to the list, let's make an adjustment to reset the list before appending each time
        if (postList.querySelectorAll('*').length > 0) {
            const listContainer = postList.parentElement;
            listContainer.removeChild(postList);
            postList = document.createElement('ul');
            postList.className = 'posts';
            listContainer.append(postList);
        }
        // I could also have done a for loop that removes all child nodes of listPosts but whatever

        for (post of listOfPosts) {
            const postElem = document.importNode(postTemplate.content, true);
            postElem.querySelector('h2').textContent = post.title;
            postElem.querySelector('p').textContent = post.body;
            // We also want to add the id to the li element inside the postElem so that we can delete it using the delete button
            postElem.querySelector('li').id = post.id;
            // postEleme itself is just the template, which contains the li elmeent, but when appending postElem, only the li is appended
            postList.append(postElem);
        }
    } catch (error) {
        alert(error);
    }
}

// fetchPosts();

// We can also make POST requests, by creating an object with the keys as expected by the server
// In this case we can make post request to the same endpoint by simply specifying a POST method
// But since we need to also send data, we need a third argument in the sendHttpRequest function
function createPost(title, body) {
    const id = Math.random(); // Since the server expects to be passed an id as well
    const post = {
        title: title,
        body: body,
        userId: id,
    };

    // Apart from JSON, we can alos use other data structures to pass the data to the server, as supported by the server
    // An important type is FormData, which we can send using a new Constructor function for it then appending key value pairs as parameters
    // const fd = new FormData();
    // fd.append('title', title);
    // fd.append('body', body);
    // fd.append('userId', id);
    // A major advantage with this is convenience, we can even send the data from our HTML form element by simply giving its reference
    // const fd = new FormData();
    // For this we need to set a name attribute to the input elements, and it automatically appends values for the keys (name attributes)

    // Finally we can pass all this to the sendHttpRequest function
    sendHttpRequest('POST', 'https://jsonplaceholder.typicode.com/posts', post);
}

// createPost('Dummy', 'Dummy body');
// We can look at the network tab inside the payload tab, and we can see the request payload which contains the passed JSON
// A status code in the line of 200 means the request has succeeded

// We can add event listeners for the forom and the button
fetchBtn.addEventListener('click', fetchPosts);
form.addEventListener('submit', (event) => {
    event.preventDefault();
    // We can also validate the inputs, but currently let's have it like this
    const enteredTitle = document.getElementById('title').value;
    const enteredContent = document.getElementById('content').value;
    // Apparently getElementById can't be used with DOM Nodes, only on document
    // I mean it makes sense, because there's only one matching id in the entire document

    createPost(enteredTitle, enteredContent);
});

// in order to create a delete request, we need to target the entire postList then find out whether what we clicked was a button
// then we can find out the post item the button belongs to, and then we can finally delete the post item
postList.addEventListener('click', (event) => {
    if (event.target.tagName === 'BUTTON') {
        const id = event.target.closest('li');
        sendHttpRequest(
            'DELETE',
            `https://jsonplaceholder.typicode.com/posts/${id}`
        );
    }
});

// We can read more about XMLHttpRequest here: https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest_API/Using_XMLHttpRequest

// In place of the old XMLHttpRequest, which was used initially to get XML responses, before JSON became popular, we can use a new approach
// It is called fetch API, and it is already promise based, so we don't need to promisify it
async function sendHttpRequest(method, url, data) {
    // For a get request, we can simply do fetch(url) which returns a streamed data response
    // In order to convert it into a snapshot response whcih can be parsed into json, we need to chain it with .then

    // To ensure all methods, work, we need to add a second parameter to fetch which is an object
    // This object can have multiple keys, most important being method, which is set to 'GET' by default
    // We can allso add a body key which takes a JSON string
    return fetch(url, {
        method: method,
        body: JSON.stringify(data),
        // Instead of using JSON, we can also send the FormData element by simply setting the value of body key to the formdata
        // body: data,

        // We can also add another key called headers, which is some data we pass from frontend to the server, for authentication or other
        // We can send anything in the header, but unless the thing we passed is used by the server, sending it doesn't have any effect
        headers: {
            // It takes key value pairs, a common one we can use is
            'Content-Type': 'application/json',
            // We can add multiple headers here
        },
    })
        .then((response) => {
            if (response.status >= 200 && response.status < 300) {
                return response.json();
            } else {
                // Since we need to send the error to the catch chain below, we need to also return the error we throw here
                return response.json().then((error) => {
                    console.log(error);
                    throw new Error('Something went wrong server-side');
                });
            }
            // Apart from json(), we also have other methods like .text for plaintext and .blob when we're downloading a binary file
            // In order to handle network errors we can add a catch block in this chain, but it wouldn't catch errors with the received response
        })
        .catch((error) => {
            console.log(error);
            throw new Error('Something went wrong while making the request');
        });
    // We need to return fetch API call which returns a promise
}

// The difference between XMLHttpRequest and fetch is that the former has wider browser support, while fetch is already promise based
// But error handling is clunkier in the case of fetch, so we can further abstract them by making use of libraries that use one of these inside
