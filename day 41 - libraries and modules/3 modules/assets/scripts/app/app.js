// While wokring on a project, there can be many parts and it is hard to maintain a project when it has too many things happening
// A standard practice is to have one class/one big function per file and splitting file into folders so that we can make it "modular"
// For example, we can split this file into the different files like DOMHelper, Component, ProjectItem,etc
// We can also create folders for creating that segregation semantically
// While splitting into files, we usually follow a naming scheme of our choice, while keeping it consistent

// Now after separating into multiple files, we need to also include these files in the html, and we need to maintain order
// In order to use something, its prerequisite must already be loaded

// Like other programming languages, we have an option to import from other files
// We import stuff when there's a dependency, for example our tooltip.js file depends on components.js so we can import from here

// When we change our file to module type, which was introduced in ES6, we can see some errors related to CORS (Cross Origin Request)
// This is because our file is being displayed on the file system and we're not running a server, and CORS needs same server origin
// while adding modules, because we don't want other people to add malicious code to our server.
// In order to run a server, we need to install Node.JS, then we can go to https://www.npmjs.com/package/serve
// There we can see a library called serve which needs to be installed using 'npm install -g serve' where g stands for global
// Then we need to use 'serve' command to run the server, it runs on a port and we need to restart server when we make changes to code

// Since we want to work with all files as modules for the App, we need to look for dependencies across the files
// We can start from this file which requires ProjectList as a dependency, so we export it there and import it here

// When eveything was in the same file, we could create a global variable or object, but in this case, the scope lassts as maximum of inside the file
// In order to make the global data available, we can add attributes to the window object which is defined for each file automatically
// window.DEFAULT_VALUE = 'something';
// By default, all apps using modules run in strict mode so we can't access 'this' object globally, instead we can use globalThis
globalThis.DEFAULT_VALUE = 'something';
// Now this value is available across the files, and must be used only when all files need it, else use export for all data types

import { ProjectList } from './project-list.js';

class App {
    static init() {
        const activeProjectsList = new ProjectList('active');
        const finishedProjectsList = new ProjectList('finished');
        activeProjectsList.setSwitchHandlerFunction(
            finishedProjectsList.addProject.bind(finishedProjectsList)
        );
        finishedProjectsList.setSwitchHandlerFunction(
            activeProjectsList.addProject.bind(activeProjectsList)
        );

        // const timerId = setTimeout(this.startAnalytics, 3000);

        // document.getElementById('stop-analytics-btn').addEventListener('click', () => {
        //   clearTimeout(timerId);
        // });
    }

    static startAnalytics() {
        const analyticsScript = document.createElement('script');
        analyticsScript.src = 'assets/scripts/analytics.js';
        analyticsScript.defer = true;
        document.head.append(analyticsScript);
    }
}

App.init();
