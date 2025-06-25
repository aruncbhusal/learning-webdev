/* In this project, the main job here is to use any API of our choice, and create a project from scratch to make a website
A list of APIs we may want to use can be found at https://github.com/public-api-lists/public-api-lists
Another list is available on https://rapidapi.com/collection/list-of-free-apis
We can choose any API which has a get request, and use Node+Express, EJS, Axios to create the website

The API may have CORS(Cross Site Request Sharing), which is a browser policy that allows a client to make a request to a server
The request may be an AJAX request or a REST request. It, alongside with SOP(Same Origin Policy) are used by the browser
to protect from XSRF/CSRF(Cross Site Request Forgery), where a malicious third party tries to run a script in our browser
It would exploit the cookies in the browser that were stored as a part of login to banking, social media, etc,
and make a request using that cookie, acting as the user and hence causing damage. CORS mends this by adding a header about origin
And only whitelisted origins are given access to request.

I looked around for free APIs and the one that I will use is Nekosia.cat which provides anime images
The reason I chose it is because of its relative simplicity (no authentication), but authentication wouldn't be a problem
Another reason I selected it is because it doesn't have many endpoints, basically its job is to get a random anime image
So I'll use it here */

import express from 'express';
import axios from 'axios';

const app = express();
const port = 3000;
const API_ENDPOINT = 'https://api.nekosia.cat/api/v1/images/';

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('index.ejs');
});

app.post('/image', async (req, res) => {
    const category = req.body.category;
    try {
        const result = await axios.get(API_ENDPOINT + category);
        const img_obj = result.data.image;
        const anime = result.data.anime;
        res.render('index.ejs', {
            image: img_obj,
            anime: anime,
        });
    } catch (error) {
        console.log('There was an error making the request: ' + error.message);
        res.render('index.ejs', {
            error: 'Sorry there was an error, please select another category or try again later',
        });
    }
});
// At this point it's already very late and I don't want to waste any more time, so I'll just copy GPT's code here
// The image didn't load because the CORS policy was set to same-origin for the cdn, so it couldn't be displayed on my ejs file
// I will need to use a proxy to get the image from the server and send it there
app.get('/proxy-image', async (req, res) => {
    const imageUrl = req.query.url;

    try {
        const response = await axios.get(imageUrl, {
            responseType: 'stream',
            headers: {
                // You can spoof referer if needed, but Nekosia usually doesn't care
                Referer: 'https://nekosia.cat',
            },
        });

        res.set('Content-Type', response.headers['content-type']);
        response.data.pipe(res);
    } catch (err) {
        console.error('Proxy failed:', err.message);
        res.status(500).send('Image proxy failed');
    }
});

app.listen(port, () => {
    console.log(`Server is now listening on port ${port}`);
});
// Okay whatever this is the project then.