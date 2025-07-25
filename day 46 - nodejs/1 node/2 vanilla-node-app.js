// Apart from the file system, one of the most important use cases of Node is to create a web server
// We can use the http module to create a server and listen for incoming requests, rather than making them(primarily)
const http = require('http');

// With this module we can use the createServer method which takes a callback with two arguments, a request and a response
// We can work with the http request that came from the client, and we can send the response
const server = http.createServer((request, response) => {
    // We will simply send a response here
    //                          response.write('Hello welcome to the page');
    // We can also send html elements as the response but when we send html chunks, some browsers can guess what it is, some can't
    // So we need to be explicit by setting a header for the content type
    //                          response.setHeader('Content-Type', 'text/html');
    // We can use text/plain if we want the string to be parsed as normal text only
    //                          response.write('<h1>Hi welcome</h1>');
    // To change the output in the browser, we need to stop the previous server and restart with updated file

    // And we need to also end the response
    // response.end();

    // We can also receive information from the user. When the website is being loaded in the browser, it sends a GET request
    // When the user submits some data with a form, it is sent as a POST request. We can receive such data inside an array as it is in chunk form
    const data = [];
    // just like client side JS's event listener, we can also add an event listener here with the on method
    request.on('data', (chunk) => {
        // We can store this chunk/stream into the data array, then combine them all into a string at the end
        data.push(chunk);
    });
    request.on('end', () => {
        // When the stream has finally ended, we can combine them all to create the actual data sent
        // We need to store the received info from the form in a variable
        const received = Buffer.concat(data).toString();
        // We send the 'username' with name attribute set, so we can see the result in the format 'username=<Entered Name>'
        // We can simply access it here, but we need to ensure we also handle the case where there is no data i.e. first time loaded
        let username = received ? received.split('=')[1] : 'Unknown User';
        // Now we can use this in the response to the user along with the form
        // Since on() is asynchronous, we need to put all the code inside here, or as then()
        response.setHeader('Content-Type', 'text/html');
        response.write(
            `<h1>Hello ${username}</h1><form method="POST" action="/"><input type="text" name="username" /><input type="submit"></form>`
        );
        // For the form we need to give method as POST and action as the page which we want to send the user to
        // Here we're not using any client side validation so the default behavior i.e. a request with method as in method attribute, to route in action
        // is performed, so we get the data as request to the server, and we can respond to it
        response.end();
    });
});

// And we need to listen to a port, at which we can access the server
server.listen(8484);
// When we run the file it keeps listening for requests and sends back the response from server side

// But writing code like this is cumbersome, and there might be a lot of complexity involved with larger projects
// So just like we had frameworks like React, Vue, Angular, etc, we also have frameworks for NodeJS, and one of the most popular is ExpressJS
// We can install express using npm like we did before, but since we're running with node, we don't need anything like webpack to work with node modules
// Node can natively work with them well
