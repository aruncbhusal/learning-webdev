// When we're working on a project, some logic might be specific to the project, but a lot of the times, we have common logic needs
// For these common logic needs we can use third party libraries, which are packages of code which we can use in our application
// So that we don't need to deal with logic that has already been handled, saving us time and effort

// They are used to offer utility to our application so we don't have to reinvent the wheel and can write logic exclusive to our application
// An example of such a library is Lodash, which allows us to perform various operations using the methods it offers
// In order to use it we can go to https://lodash.com/ and download the "Full build", which is a .js file that contains the library
// We can instead download the gzipped file which is a .min.js file, and it is an optimized version of the library
// Instead of using a library by downloading it, we can also use a CDN, where we use a link to the file in our src
// Mostly CDNs are preferred because they reduce the load on our server by not having to send the JS file along with the request
// And they are normally faster than our server

// Now let's take an example problem of finding the difference between two arrays
const array1 = ['Apple', 'Apricot', 'Ball', 'Ballerina', 'Camel', 'Cricket'];
const array2 = ['Apple', 'Ball', 'Cricket'];

// Now in the lodash documentation we can find a method that can be used to find the difference between two arrays
const diffArray = _.difference(array1, array2);
console.log(diffArray);

// There are lots of JS libraries available, they can be used in browser side JS as well as NodeJs and there are libraries for other languages too
// Some libraries/frameworks are huge like VueJs, Angular, React, etc, and some are smaller utility libraries
// An important library is jQuery: https://jquery.com/
// It used to be very popular and is being used less recently because of changes to DOM APIs in JavaScript recently
// It was used to make DOM actions easier, but native JS DOM APIs can do a lot of things themselves as well

// But how do you find out about these JavaScript libraries? There is no popular page that just lists interesting libraries
// We can use npm.js to find libraries whose name you already know, but to find libraries we can simply google the problem we have
// Then in some article/StackOverflow discussion, someone might mention a library, from where we can look it up
// Almost all libraries have their own GitHub repositories, where open source code is shared, and we can look at the repository for information
// They also have instructions on how to use the library. One such library which we can use to send Http Requests is called Axios

// We can use the Axios library in the project we did earlier, I will copy that folder into this day's folder for it

// Considerations while working with Third Party Libraries
// Libraries have a lot of code and functionality, which might slow down the application loading time, especially if internet is a concern
// Some libraries, like lodash, have a core build which is smaller in comparison and can load faster, and we can selectively use its functions
// Another thing to consider is whether a library is being actively developed, either by the development team or by open source team
// It can be seen by the last commit, last release, any major issues that can be seen in the Issues tab of GitHub, and more
// If the library has broken logic or does not support a particular browser, we may need to modify or write our own code from scratch as well
// Using libraries is not bad, and it is recommended to use libraries to make workflow easier, but we need to be careful while choosing what to use
