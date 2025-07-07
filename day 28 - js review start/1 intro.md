Day 28 aka 7/7/2025: I finally start **JavaScript: The Complete Guide** by _Maximilian Schwarzmüller_

### Before I start

I've taken quite a few courses on web dev. I hope this will be the last, before I can move on to learning by building instead. I took Frontend Masters' courses last year, then Angela Yu's course, which is inside this very repository. Since I've already been in this cycle for a while, for this course, I will only do the notable aspects such as the projects, features I didn't know before, as well as theories I might want to reference in the future.

## Introduction to JS

I won't write code unless it's something new. The rest I might put here instead.

-   JavaScript is a dyanmic, weakly typed programming language compiled at run time.

There was an example shown but it's just an example so I'll just note the key takeaways:

-   JS is used to make websites dynamic and avoid making multiple requests to the server and load multiple pages
-   It can do so by changing the pre existing content of a page, or adding more information/removing information
-   When we use a script tag inside the head of the html, we can use "defer" attribute to load the js after everything else

#### How is JS Executed?

-   The JS code we write passes through the Javascript Engine before we see its effect. Chrome has V8 Engine, Firefox has SpiderMonkey.
-   The engine parses the code, compiles to machine code then executes the machine code. The execution takes place on a single thread.

#### Dynamic and Weakly Typed

-   JS is dynamic and interpreted, which means the code is parsed and compiled on the fly instead of pre-compiling. Since code is evaluated at runtime, data types can change.
-   JS is weakly typed, meaning data types are assumed to variables and we don't need to assign them manually. The data type for a variable is allowed to change.

#### Runs on a hosted environment

-   JS was originally designed to run on browsers, able to manipulate HTML and CSS, make background HTTP requests, etc, but can't access local filesystem or OS
-   Google's V8 Engine was extracted to create Node.js which can be used in servers for backend, with file system capabilities, but it can't manipulate browser environment.

#### Course Structure

I think I'll need to divide my time according to this, so here's what comes next:

-   **Core Basics:** Syntax, Debugging, Control Structures, Functions, DOM, Arrays, Iterables, Objects
-   **Foundation:** Classes, OOP, Constructor, Prototype, Browser APIs, Events, Numbers and Strings, Asynchronous Code, AJAX
-   **Advanced:** 3rd Party Libraries, Modules, Tooling, Browser Storage, JS Frameworks, Meta Programming, NodeJS, Security, Deployment, Performance and Memory

My plan is this: 3-6-9 days for each of these, hopefully will be enough. Might go sideways, but this is the original plan.

#### Java vs JavaScript

-   Java is an object oriented, strictly typed language, while JS is dynamic and weakly typed, with object oriented abilities. JavaScript is called JavaScript just to sound cool because Java was popular when it was named.
-   Client-side JavaScript runs in the browser and is the only language that can run on the browser, and interact with Browser APIs. Server-side JavaScript can run anywhere, and uses special non-browser APIs instead.

#### History of JavaScript

-   Netscape introduced _LiveScript_ in 1995, Microsoft used their own variation in Internet Explorer. JavaScript submitted to ECMA in 1997.
-   Standardized by ECMA but Microsoft didn't adopt it until 2005, but by 2011 it was used by Microsoft as well.
-   ECMAScript is the actual language but browsers have their own implementations like JavaScript, ActionScript and jScript.

This was the first module. The next one seems to have a starting file so will continue in the project files.
