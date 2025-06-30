### What is React?

React is a front end JavaScript framework that lets us create customizable and beautiful User Interfaces using components.

We just combine these components together to create our entire page. Each component has its own HTML, CSS and JS and can be independent.

It is the most used front end framework currently, being used by Facebook, Twitter(X), Reddit, AirBnB and much more.

Any change to the page requires only the changed component to re-render, so loading new content doesn't need page refresh either.

#### Things we'll complete in this module

It might take me until tomorrow to complete this module, being as big as it is, but these are the things I should have done by then:

1. Simple Registration Screen
2. Real Time Clock/Timer
3. Emoji Dictionary
4. To-Do list
5. Final project: Keeper (Notepad like Google Keep)

#### CodeSandbox.io

It is an IDE similar to VSCode but on the web which helps to run our code in a "sandbox" isolated from everything else.

We will be using it throughout this module, and after completing a sandbox, I will download it into this folder

### Notes from 21.3: ES6 Imports/Exports

We can use the ES6 syntax for imports and exports to make our code modular and separate into multiple parts, or use other's codes.

Let's say we have a file called `helper.js` which has a variable or function or others as item1, item2, item3. If it has at the end:

```js
export default item1;
export { item2, item3 };
```

Then we can import them into any other file. Let's say we have an index.js. We can import just item1 using

```js
import item1 from 'helper.js';
```

But we're not limited to this name, in fact we can call this default export anything, there's only one default export per file.

```js
import item from 'helper.js';
```

This would import item1 into the file as well. What if we wanted item 2 and 3 as well? We could use:

```js
import item, { item2, item3 } from 'helper.js';
```

One thing to note here is that item1 can still be called item, but we can't call item2 and item3 anything else.

We can also use the wildcard character to get all the imports as well, here's how we can import and use them:

```js
import * as items from 'helper.js';
console.log(items.default);
console.log(items.item2);
console.log(items.item3);
```

But this is not recommended by the style guide because it becomes ambiguous.

### Setting up React Environment in Windows

I did 21.2 and 21.3 in codesandbox.io but the projects I'd rather do in VSCode, so we need to set up the environment for it first:

#### 1. Up-to-date Node

We can use `node --version` in our terminal to see the version of Node we're running, and see if it is latest at [Node website](https://nodejs.org)

If it is not latest, we can download the LTS from the site and install it so that we have an updated Node installation.

#### 2. Install IDE (VSCode)

I'm doing everything with VSCode from scratch and downloading it is simple, we can go to [Visual Studio Code Site](code.visualstudio.com)

In [Babel Docs](https://babeljs.io/docs/editors) we are suggested to install an extension called vscode-language-babel for syntax highlighting

#### 3. Create React App

We can look at [Official React site](https://react.dev/learn/creating-a-react-app) to see how to create a react app from scratch or in existing project.

The docs currently advise on using Vite/Parcel/Rsbuild to create from scratch. But the course uses Create React App.

For 21.4 I will use this, but in tomorrow's lessons I will probably use the methods suggested in the docs.

When we use `npx create-react-app my-app` it creates a folder called my-app where we can run `npm start` to start server in localhost:3000

#### 4. Run App

After the React app is created and we run it, we can see it already has a lot of components, as well as static files.

We can remove all of them except for index.html and index.js so that we can begin from actual start.
