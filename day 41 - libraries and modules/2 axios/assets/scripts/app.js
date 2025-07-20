let postList = document.querySelector('.posts');
const postTemplate = document.getElementById('single-post');
const form = document.querySelector('#new-post form');
const fetchBtn = document.querySelector('#available-posts button');

// Since Axios can deal witih each type of request separately we don't need to have ta separate function for sending the http request
// We can simply use Axios by using the CDN like before, there is another method as well (for NodeJS)
// After adding the cdn <script> in html we can simply access the axios object in our application

async function fetchPosts() {
    try {
        // const responseData = await sendHttpRequest(
        //     'GET',
        //     'https://jsonplaceholder.typicode.com/posts'
        // );
        // const listOfPosts = responseData;
        // We can simply call the axios.get method to send a 'GET" request
        const response = await axios.get(
            'https://jsonplaceholder.typicode.com/pos'
        );
        // The response appears not as streamed data but as ready to use snapshot.
        console.log(response);
        // Inside this response object, we have a data property which contains the json data already converted to a JS object
        const listOfPosts = response.data;
        // This is how we can easily make a http request with axios

        if (postList.querySelectorAll('*').length > 0) {
            const listContainer = postList.parentElement;
            listContainer.removeChild(postList);
            postList = document.createElement('ul');
            postList.className = 'posts';
            listContainer.append(postList);
        }

        for (post of listOfPosts) {
            const postElem = document.importNode(postTemplate.content, true);
            postElem.querySelector('h2').textContent = post.title;
            postElem.querySelector('p').textContent = post.body;
            postElem.querySelector('li').id = post.id;
            postList.append(postElem);
        }
    } catch (error) {
        // Axios handles errors itself and throws the error if it is detected even after the response is received
        // In such case, the response is inside error.response, and the message is in error.message
        alert(error.message);
        console.log(error.response);
    }
}

async function createPost(title, body) {
    const id = Math.random();
    const post = {
        title: title,
        body: body,
        userId: id,
    };
    // sendHttpRequest('POST', 'https://jsonplaceholder.typicode.com/posts', post);
    // Similarly for the post request, we can simply send the request using axios.post
    // Axios automatically handles the data type of the data we send. Here we're sending an object, which is converted to json
    // If we send formdata, it sends it as such, and modifies the headers accordingly so we don't need to specify headers ourselves
    const response = await axios.post(
        'https://jsonplaceholder.typicode.com/posts',
        post
    );
    console.log(response);
}

fetchBtn.addEventListener('click', fetchPosts);
form.addEventListener('submit', (event) => {
    event.preventDefault();
    const enteredTitle = document.getElementById('title').value;
    const enteredContent = document.getElementById('content').value;
    createPost(enteredTitle, enteredContent);
});

postList.addEventListener('click', async (event) => {
    if (event.target.tagName === 'BUTTON') {
        const id = event.target.closest('li');
        // sendHttpRequest(
        //     'DELETE',
        //     `https://jsonplaceholder.typicode.com/posts/${id}`
        // );
        // We can make delete request in a similar way
        const response = await axios.delete(
            `https://jsonplaceholder.typicode.com/posts/${id}`
        );
        console.log(response);
    }
});
