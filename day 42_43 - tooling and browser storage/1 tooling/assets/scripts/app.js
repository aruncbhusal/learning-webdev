// Once again working from the base of the last project, we will learn about tools that will make our job easier
// Because we had problems having to make many http requests to get the required modules from the server
// One of the tools we use is the serve module which is used to start the development server so that modules can work

// A basic JS app may have the following limitations:
// 1. Serving from the file system doesn't simulate real world well, so it may be flagged with CORS errors, so we should use development server
// We prefer a server that has auto reloadability. Options for tools are webpack-dev-server and serve
// 2. Micromanaging imports and multiple http requests needed for each module leads to harder to manage projects
// For bundling these modules and files, we can use the Webpack tool
// 3. Code optimization is necessary for smaller file sizes, may lead to less human understandable code, but one that machines can understand
// It might include smaller function/variable names, removal of whitespaces etc. This can be done using Webpack plugins
// 4. Browser support may not be available for all new features so we need Code compilation/transpilation into older version so it works with all
// For that, we can use tool called Babel
// 5. For ensuring code quality, even though there is no right/wrong way to do something, we can use a tool called ESLint

// During development and production, these tools use NodeJS internally so it is important
// During development (file saving etc) we need to Lint (ESLint) then bundle (webpack) and reload web server
// During deployment i.e. running server we need to Lint, Bundle, Transpile, optimize then finally get production ready code

// To work with linting, we need to install the ESLint extension from VSCode extension store, then we can use Ctrl+Shift+P
// Here we can search for ESLint and enable it
// Then we need to work with a npm project so in order to make our current project a npm project we need to use npm init and get a .json file
// After the npm project has been initiated and package.json created, we need to get the ESLint module for this project
// We can use 'npm install --save-dev eslint' to install it as a developer dependency i.e. we don't use it in our program but need it to run
// After the installation is done, package-lock.json is created which has names/versions of all dependencies of the dependencies we have in package.json
// The node_modules folder contains the files for all these dependencies

// In order to use ESLint we need to set up a config file, we can do it from the Ctrl+Shift+P dropdown
// While creating the config, we can answer the different questions asked according to our project needs
// It generates a eslint.config.mjs file which may have rules or not, we can configure them as per project requirements
// ESLint configuration guide: https://eslint.org/docs/latest/use/configure/
// We can see the different rules here: https://eslint.org/docs/latest/rules/
// We can use eslint configs used by other people by getting from https://www.npmjs.com/search?q=eslint-config
// Finally, we can also look at https://eslint.org/docs/latest/use/getting-started for more info

// We will be working with webpack version 4 so we need to instlal webpack@4 with --save-exact flag as well
// For this to work, we need to also install another package, using npm install cross-env
// We need to also add another key-value pair inside package.json as "build": "cross-env NODE_OPTIONS=--openssl-legacy-provider webpack",
// When adding more scripts, we need to use cross-env NODE_OPTIONS=--openssl-legacy-provider before the rest of the script

import { ProjectList } from './App/ProjectList.js';

globalThis.DEFAULT_VALUE = 'MAX';

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
        analyticsScript.src = 'assets/scripts/Utility/Analytics.js';
        analyticsScript.defer = true;
        document.head.append(analyticsScript);
    }
}

App.init();

// too late today, will continue tomorrow
