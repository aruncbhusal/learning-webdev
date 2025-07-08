# Efficient Development and Debugging

It involves things that make our development, and then maintenance of projects, easier.

## Writing Code Efficiently

In order to write code efficiently, we need to optimize the following things

-   A productive development environment i.e. IDE
-   Auto format tools and shortcuts
-   Auto completion and hints
-   Extensions and settings

### 1. Making the IDE more productive

We should customize the IDE to match our needs and aesthetics so that working in it becomes second nature. Look out for:

-   **Color Theme:** There are many to choose from, dark and light. Pick one that suits your taste and comes naturally
-   **Icon Packs:** A popular one is Material Icons, we can pick one that lets us discern the file types and fits with the rest of our IDE's appearance
-   **Appearance Tab:** Show or hide sidebars and other tools as per need

### 2. Using Shortcuts

When we open the menu we can see the available options on the side. We can use them to make our work faster. We can also choose to change the shortcuts in File > Preferences > Keyboard Shortcuts. The list of shortcuts can also be found there.

It is good to look around and try out shortcuts that might be useful, like Ctrl+/ for commenting, or Ctrl+D to select the next occurence of current word, to change multiple places at once.

### 3. Auto-completion and Hints

When we're typing something, the IDE gives us hints about what we might be trying to type, we can press Enter or Tab to autocomplete, and we can use Ctrl+Space to get those hints if we lose it by pressing a space, for example.

Furthermore, it also gives us hints when we use the dot operator on an object, also it gives us descriptions on the side about the function/property.

When calling a function, after we press the parentheses, it gives hints about the parameters of the function, and after we press , it underlines the next parameter. We can get it back if we lose it using Ctrl+Shift+Space. We can see the shortcuts in the shortcuts menu.

### 4. Installing Extensions

We can search for extensions or install recommended ones, a useful extension is Prettier, which helps to auto-format our code. We should be careful not to have too many extensions or they might conflict and cause unintended behavior, or make the IDE sluggish.

### 5. Configuring settings

We can go to File > Preferences > Settings to change the settings for the IDE and the extensions. We can change the appearance like font sizes and types, and also behavior, like the number of spaces used for indentation. We can change the settings for "User" which applies to all of our projects, or "Workspace" which only affects current project and creates a .vscode folder which contains a settings.json for current project. There's an [official guide for VSCode settings](https://code.visualstudio.com/docs/configure/settings) we can see.

### 6. Views

We can look at the view menu and see different options:

-   **Explorer:** The one we'll use the most, lets us view the current workspace
-   **Search:** When we want to find and/or replace some variable name or information but don't know where it is
-   **Source:** Helps with Git and source/version control, letting us see changes, make commits
-   **Debug:** Helps find where our code has an error, helping us to fix any we might get.

## Knowing how to get help

Developing isn't something we have to go solo commmando on, we need to make use of the help we can get to create the things we want. Nobody can do it all. These are the things we need:

### 1. Using MDN(Mozilla Developer Network) Documentation

MDN has a comprehensive guide on web development and most importantly, JavaScript, because it has many features which we might forget or don't know. We can simply google 'mdn splice' to get information about the splice function, for example. It also has lessons to master JS concepts which we can make use of.

ECMAScript, the language "behind" JS is in active development and we can visit the [official documentation page](https://www.ecma-international.org/publications-and-standards/standards/ecma-262/) for a peek. We DO NOT need to know this document by heart, it mostly serves as a reference for browser vendors.

### 2. Learn to ask questions properly

It is important to know what to search on Google when you're stuck. There are resources like W3School, MDN Docs and Stack Overflow, which is a forum where people ask questions. Using concise phrases can lead to better results, and in programming, there may be multiple ways to solve the same problem. We need to know how to ask the right questions with enough context to solve our case. Also, helping other developers with their problems makes us a better developer as well.

### 3. Trial and Error

The code will break at some point. Rather than being discouraged, we should try alternative solutions, look around, make changes and fiddle around to make it work. That is the most important part of becoming a developer.

## Debugging your code

Problems in code are extremely common. What separates a bad developer from a good one is the ability to debug or fix the code. We need to keep the followings in mind:

### 1. Reading error messages

Syntax errors like missing comma or closing brackets are detected by the IDE and it gives us indications with red lines under the error part, we can hover over it for insight, but they can normally be noticed when pointed to us by the IDE.

When instead of syntax, we have errors like typo in function name or other mistakes that breaks the code at run time, the errors can be found in the developer console in the browser. It gives us description about the error, and the line number where the error occured. If we press on it, it even shows us the source code at the line where the error occured, so that we can then fix it.

### 2. console.log() to find errors

When there's a logical error, where the code works but it's not doing what we intended, we can use console.log to log out values that might have broken the code. We simpy place it in the middle of the code and it logs out the values we want it to. We can also log out multiple values by separating them with commas. We can also use multiple log statements to ensure the code flows as we intend it to.

### 3. Using debugger in the browser

Inside the developer tools, we can go to source and the script file we're working with, then we can click on the line number where we want to set a breakpoint. This allows us to pause the code execution when we reach the line. We can hover over variables to see values, go step by step, or move to next function here, checking for where it went wrong.

We also have the bottom pane which has the variables in local and global scope, and their values, we also have a watcher where we can specify a certain variable we want to track through the different lines. We can also trigger conditional breakpoint by right clicking on line number and specifying the condition eg. when an entered value is negative. We can also trigger the debugger on an event eg. when mouse is clicked. Using these available tools can help us identify and correct our code faster.

### 4. Testing changes in the browser

Instead of changing local code which may break our site further, we can test changes in the browser by modifying the source code. This lets us verify correctness before we add the feature to our actual file.

### 5. Debugging inside VS Code

We can also install the Chrome Debugger extension on VS Code use it to debug our code inside the IDE instead. We can set breakpoints by clicking to the left of line number, and we can go to Debug > Start Debugger to initiate the debugging tools. It opens a launch.json file where we can change the link to open with the file:// link we can see ont he browser when we open our html file, then we can use the debugger for our code.

This is how we can make writing JavaScript code efficient and easier.
