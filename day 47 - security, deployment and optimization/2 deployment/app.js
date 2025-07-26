// There was another same project here, but since I'm not going to deploy code written by Max, I will simply lay out the steps needed
// After developing, testing an application, we might want to not only run it locally on our machine but deploy it as well
// So that it can be connected to a domain and the app can be used by other people on the internet

// Different Kinds of Applications/Websites
// 1. HTML+CSS+JS: static application: These applications don't have a server side, and all code can be run on the user's browser
// For these kinds of sites, we can use static hosting, like AWS S3, Google Firebase, etc. They simply hold the files there
// They can send these files upon request after making some configurations, and they donot run any code by themselves
// 2. Server side (NodeJS/php): dynamic application: When the application needs to use the backend, store data into a database, etc,
// We can use services like AWS Elastic Beanstalk, Heroku, etc, where the server side JS/other language is run as well, and may send files
// In server side apps we make use of templating engines like ejs to give a dynamic html response to the user

// There is also another type of application: Single Page Applications (SPA):
// In these sites, HTML+CSS+JS are served and client side JS is used to re-render the site dynamically based on user actions/dev intentions

// Deployment Steps
// 1. Write the code
// 2. Test the code
// 1 and 2 are iterative processes, we write, test, and repear until we're ready with the final product
// 3. Optimize using tools like Babel and others to make the code run faster
// 4. Build for production so that it is ready to be shipped to the users in the smallest form factor possible
// 3 and 4 are iterative as well, we optimize it, build it, optimize again, etc, but it is relevant for client side JS only
// In server side JS, we don't need the smallest file sizes or hacks, since the code is run on our browser and doesn't need to be sent to user
// 5. Deploy the code

// Example Deployment Scenario: Our "Share My Place" App
// We write our code, test it and use libraries like sanitize-html to prevent security holes, and we're ready for production
// Then use use the development configuration using webpack in our scenario to generate hashes for file names
// We use the generated file names in our index.html, which can be made automatic, but requires advanced webpack knowledge so we can do manually
// To automate it, we can use the html webpack plugin https://webpack.js.org/plugins/html-webpack-plugin/
// Detailed steps can be found at https://github.com/jantimon/html-webpack-plugin
// Then we're ready for deployment. For it we can search for static hosting on the internet and use paid/limited free services to host our app

// Hosting with Google Firebase (for static hosting)
// We can look at the documentation at: https://firebase.google.com/docs/hosting/quickstart
// Firebase is free to start but advanced use cases are paid, in order to get started with Firebase we need an account which can be Google
// We need to install the firebase module into our system using 'npm install -g firebase-tools' or we can install firebase application
// Then in our project folder we do 'firebase init' to start a firebase project where we need to define what to name our project
// We also need to define the public folder i.e. where the static files are located, for which we select dist (as in our application)
// And we can select whether it is a SPA or has multiple html pages, our project falls under latter
// After all is set up we can use 'firebase deploy' which deploys the site and gives us a link where we can access the application online
// We have some config files from firebase, and also a 404.html page we can modify for any 404 responses from the hosting server

// Hosting with Heroku (for server side code)
// In the server side application we wrote with Nodejs using mongoDB, we can't use Google Firebase to host it and run the server side code
// So we can search for NodeJS hosting or php if we're using that for our server side code. We can use Heroku for that which offers free tier
// We can follow the documentation from Heroku as well: https://www.heroku.com/nodejs/
// For it we need to have a git directory set up, we can use Git for Version control. First we need to do git init to convert our project
// then we can connect to the heroku app we create on the web using heroku create
// We need to add a 'start' script to the package.json with 'node app.js' so it knows what to run
// We also need to create a Procfile file in the directory which contains 'web: node app.js'
// The port we're listening to should be process.env.PORT which is given by Heroku itself while deploying, and we can set a fallback there
// After adding and committing the git project, we can deploy it using git push heroku main or git push heroku master based on main branch name
// Then we can go to the endpoint to get the json response we had given in the past
