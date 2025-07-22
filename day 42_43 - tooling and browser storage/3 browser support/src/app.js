// When we use JS with features like fetch(), it will work on the browser we're testing but not everyone uses the same browser
// Some people may use browsers that do not support certain features. Browser support is the fact that browser may or may not support everything
// We may write our JS code in a way but if the browser does not support it, it can't be run because Browser APIs may not = JS Syntax
// features like DOM manipulation, geolocation, fetch() are APIs that a browser may or may not offer, despite its JS engine supporting syntax
// Browser APIs are generally added individually, while JS Syntax changes might be made individually or in chunks, like the ES6 change
// Mordern browsers may have the updated functionality for new syntax, and there may be a way to implement a syntax in older JS version as well
// But some browser APIs may simply not be possible to implement in "legacy" browsers like IE8, in which case they'd need to update

// When working on a project we might need to look at which features are supported by which browsers and make decisions accordingly
// 1. MDN Docs: When looking at a browser feature, it has a compatibility table at the bottom which shows what browsers and versions support it
// It also has guides, fallbacks, workarounds and resources for the features
// 2. Caniuseit.com: It offers a searchbar where we can look at browser support along with marketshare so that we know how many people can't use
// the feature, and we can also find fallbacks, workarounds and additional resources there
// 3. Google and stackoverflow: They can provide invaluable resources in terms of tips, browser support hacks and workarounds etc
// 4. JS/ES6 Compat Table: We can look it up and see the different features and their support in a tabular format

// We need to determine what browsers we want to support
// We should not strive to support ALL browsers available because that strips away a lot of features and makes development tedious
// We should instead look at our target audience, their demographics, whether there's a standard set in place for browser versions
// And we need to make a decision to let go of a minority population that doesn't use a supported browser, showing them a warning

// Feature Detection and Fallback Code
// For features like navigator.clipboard, the browser support is not that wide, but if we want to use it, we can branch our execution
// If the feature is available (not undefined) we can execute the code normally, but if not, we can show some message or error
// Inside this file we have everything but the app.js set up, and we simply need to install the npm packages, then run the webpack server

// For unsupported features, we can also use something called Polyfills
// They are third party libraries that implement the behavior of a missing feature on a browser by using features already available
// Like the Promise polyfill, Fetch polyfill. We can find them in resources of caniuse or via google search, but all features can't have them
// Some features depend on new core browser constructs and polyfills might not be able to bridge the gap

// For core JS features like keywords eg let, const, arrow functions, we can't use fallbacks or polyfills because the engine itself would reject
// In such case we need to use transpilation, which is the act of converting modern code into code supported by older browsers
// The most popular tool used to do this is called Babel, which can be found at https://babeljs.io/docs/
// In order to user Babel we need to install multiple packages, specifically for webpack we need babel-loader package
// From https://github.com/babel/babel-loader we can get the instructions for it, to install the required packages we can use
// npm install -D babel-loader @babel/core @babel/preset-env
// Here -D simply is short for --save-dev and we need babel loader 8.X since that is the version which supports webpack 4.X i.e. 8.2.5
// The preset-env module is what enforces the conversion: https://babeljs.io/docs/babel-preset-env
// After installing, we need to copy the module object from babel loader docs and paste in webpack config files, order doesn't matter
// Finally we need to also update the package.json file with a "browserslist" so that the config updates the code based on what we want to support
// We have added '> 0.5%, not dead' which specifies that we need to support browsers with greater than 0.5% marketshare and are not dead
// We have many options and can even select specific browsers. https://github.com/browserslist/browserslist#full-list
// Finally we can run the normal 'npm run build' to generate the transpiled file

// But this only changes the JS Syntax constructs, and we can add Polyfills to that so that we can replace browser features like Promises
// For that we can install polyfills from third party library, but managing all polyfills can be tedious, but Babel has a solution
// It relies on a package called core-js which is a large bundle of polyfills that can solve many support problems
// But since it is so large, we don't import it completely and instead want only the parts we need, like the promise polyfill 'actual/promise'
// We can see the github https://github.com/zloirock/core-js and install it with npm install --save core-js
//                                      import 'core-js';
// But we want to make Babel auto-polyfill for us so we can change the module inside presets and have an array inside the presets array
// In that array, we can have an object with key 'useBuiltins' value to 'usage' or 'entry'. Default is false

// 'usage' automatically uses only the required polyfills for the project. Here the promise is not triggered on unsupported browsers
// since we already filter out browsers without clipboard support, so let's create a dummy promise
// In order to use it, we also need another library called regenerator-runtime which we can simply install as normal dependency as well
// We can also optionally specify another key for corejs with a value of an object with a key version and value 3
// This was necessary during the course, but not very much now, though we can still include it in our code

// Instead of 'usage' we can also use 'entry' for which we'd need to add imports to the file and babel would selectively import from them
// import 'core-js/stable';
// import 'regenerator-runtime/runtime';
// By using this, Babel can import all features required for the browsers list we specified, rather than the features we have used
// So this gives us a more robust way when we don't know what we need, but in our case we're not using any third party libraries
// so we don't need to do anything with all those, and we can stick of 'usage'

// The final code is the production code which we can generate with npm run build:prod

// But what about environments outside of the browser i.e. NodeJS? In such cases we can control the environment with package versions and so on
// We're doing this in order to deal with environments not under our control and may be run on any environment in the browser

// Our job here is to make the click of the button work, so that the text is copied on the clipboard
const btn = document.querySelector('button');
btn.addEventListener('click', () => {
    const text = document.querySelector('p').textContent;

    // dummy promise to see babel auto-polyfill in action
    const prom = new Promise();
    console.log(prom);

    // Now if the browser doesn't support it, navigator.clipboard should be undefined so we can simply run code only if it is not undefined
    if (navigator.clipboard) {
        navigator.clipboard
            .writeText(text)
            .then((result) => {
                console.log(result);
            })
            .catch((error) => {
                console.log(error);
            });
    } else {
        // In case the feature isn't available, we should at least let the user know
        // If the feature is not important, we can simply make it an information, but if it is important, we need to either have a workaround
        // or at least alert the user about the lack of feature
        alert('Feature missing, please copy manually.');
    }
});
