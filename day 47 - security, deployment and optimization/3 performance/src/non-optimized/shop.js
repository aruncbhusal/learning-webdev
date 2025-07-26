// This module is about performance and optimizations

// Performance
// We can define performance in two ways: startup time and Runtime performance
// Startup Time: It deals with factors like how long it takes for something to be visible on the screen, and how long until it is interactive
// Runtime Performance: It deals with how smooth the application feels, whether the animations have any lags, or are there any memory leaks
// Memory leaks make the app lag more as time goes on
// These are affected by not only JS but also HTML and CSS, because their sizes, complexity in CSS selectors, etc also make a difference

// When it comes to JS only, startup time is mostly related to browser side JS and how optimized the web server and delivery of content is
// The response time may be related to server side as well, since we might make API requests to the backend which might take a long time
// The performance is affected by how much work the JS code has to do, and whether there exist any memory leaks

// There are different layers to optimizing the JS and the web application in general:
// Startup Time:
// 1. Bundle/Script size: Larger files take longer to download, nothing new. People may be accessing from places with slow internet connection
// 2. Http roundtrips: When we have to download multiple files, we have to make multiple requests, each with their own base cost for the request
// These times add up and make the app interactive slower than it should, so we use webpack and bundle our code, and minify it as well
// Runtime Performance:
// 1. Optimize Code Execution: We should only do what we need to, avoiding unnecessary DOM operations, which are costly because of Browser API
// When we have to change a part of the DOM, we should aim to re-render as little part of the DOM as possible
// 2. Avoid Memory Leaks: Some memory leaks are useful, but in many cases, we must avoid them in order to avoid sluggish app or even crashing
// 3. Find Code Alternatives: When something is used very often, we might benefit from using a more performant technique
// 4. Micro-optimizations: Some data structures offer better performance than others depending on the use case, we can pick and choose

// Measuring and Auditing Performance
// 1. Check number of roundtrips and script/bundle size, set size budgets
// 2. Use devtools to measure performance
// 3. Explore best practices, patterns and benchmarks
// We should always test our production code for performance, not developer code because we don't optimize dev code
// Useful tools:
// 1. During development/testing, we can use performance.now() in the browser to find the delta for execution of something
// 2. Browser's dev tools provides various info on unnecessary executions, memory leaks, http requests, etc which we can optimize
// 3. jsperf.com can be used to compare alternative coding practices and their performance
// 4. webpagetest.com can be used to test a live production webpage against optimization potentials

// Now time to run this app and see what's going on using the Dev Tools
// To run the application I had to make some tweaks because the course is from a prehistoric era and uses NodeJS 12 or something
// And since then web apps have gotten more secure and older webpacks versions throw error. So we needed to update build scripts to add env var
// And install cross-env because my windows machine is not a linux machine
// We'll first run the dev version so that we can see the less optimized case

// To analyze the performance we first start at the Elements tab
// Here we can take a look at the DOM nodes when we make DOM operations, like when deleting an item, the entire <ul> and <li> flashes
// which means everything in the <ul> had to be re-rendered, making a performance loss in larger applications
// Next in the network tab, we can turn off caching so we get a true first-load expetience, and we can throttle our connection
// If we select 3G connection, we can see that it takes a long time to load our scripts file, during which the JS isn't applied to our app
// And so the page becomes unresponsive to user actions (apart from default browser behavior), so we should keep script file size in check

// In the Performance tab, we can record all the actions that happen in the page, including loading, call stack, operations, and screenshots
// We can also zoom in on a particular segment to analyze the operations in that time, such as summary of what happened and for how long
// And we can also look at the memory consumption throughout the recording.
// In the recording, we can see the interactions made by us, the network usage in the time, and more

// Similarly in the memory tab we can take snapshots at multiple points in time and compare them, to find whether our app is cleaning as expected
// For example when we delete an item, it should remove all elements that constitute that item

// Finally there's a tab for Auditing (called Lighthouse currently) which can create reports and scores for optimization and more
// It says that insights is going to replace audits late this year, whatever that means
// Here's official resource for Devtools to measure performance: https://developer.chrome.com/docs/devtools/performance
// Further JS references for optimization: https://web.dev/articles/optimize-javascript-execution

// Now instead of using npm build:prod, we can change the webpack config to simulate a production build but not exactly
// Since the file is about 8x smaller when we use this, but it is again 20x smaller than this when using actual build:dev
// We can change mode to production and devtool from cheap-module-eval-source-map to just source-map

// When using the Dev console, we can press Esc to get a tabbar which has a "Coverage" tab which when a snapshot is taken,
// It shows us what part of the code has been used so far and what has not, by testing against different actions, we can notice
// that some parts can be loaded after an action is taken i.e. lazy loading, and we can implement them
// In our code, we can see that in this file, the imports from product management file are not used until the buttons are clicked
// So we can now create a products file and split the array to that file and import the array from there
// Then we can import the products and deleteProduct here and init inside here

import { initProducts, addProduct } from './product-management';

const addProductForm = document.getElementById('new-product');

initProducts();

addProductForm.addEventListener('submit', addProduct);
