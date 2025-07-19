## Why Requests?

Normally when a HTML page is rendered, either from the server by dynamically generating, or using a static file with JavaScript to handle inputs, we need to handle the user behavior like clicking on buttons, fetching posts, creating a new post, etc. The browser has its own way of handling these data and when we use forms, the default behavior is to refresh the page, but we can choose to not do it using JS. Instead, we can take the user input, and communicate with the backend (API) through the different endpoints(URLs) exposed by the backend.
We can make different kinds of requests to the backend through these endpoints, like GET requests, POST requests, etc and be able to fetch/ push data onto the server without having to deal with reloads or default browser behavior.

### Pre-requisites for this module:

-   [How the web works (Article)](https://academind.com/tutorials/how-the-web-works)
-   [HTTP Request Methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods)
-   [HTTP Messages](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Messages)
-   [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status)
-   [HTTP Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers)

## HTTP

The client side is detatched from server side/backend, the server communicates with the backend to store/retrieve data, the frontend cannot. It would be a security risk if frontend could access the database and change things there.The frontend and backend communicate via HTTP requests/responses. The URL/endpoint consists of domain and a path. The server decides which paths are to be exposed via the API. Along with paths, HTTP Methods are set, like GET(to fetch), POST(to push), PUT, PATCH (to update), DELETE. The path-method combination must match while making requests.
Along with the request, we send HTTP Headers, which hold information about the request, and in some cases, like POST, PUT, PATCH requests, HTTP Body(Data). This data may be in different formats like JSON, FormData format, Binary, etc. The frontend deals with fetching and sending data from and to the client, while backend deals with retriving and storing data on the database/persistent storage.
