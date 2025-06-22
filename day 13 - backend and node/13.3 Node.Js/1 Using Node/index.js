/* Node.JS is an asynchronous, event driven javaascript runtime that allows us to run scalable network applications.
Here asynchronous means that it is non-blocking, and we can allow blocks of code to run after some trigger rather than waiting for the run condition.
This way we can free our system resources, and perform more tasks because of the time freed.
It is event driven in the sense that it responds to the user events, making sure only the relevant program is executed.
We can develop applications for our web app in our server (computer) using Node, which runs on the V8 engine.
The V8 engine is what runs Chromium as well. Node allows JavaScript to be run out of the browser, and thus is a runtime environment.
It is not a framework.
*/

/* Installing Node.JS
From http://nodejs.org/ download the LTS(Long Term Support) version, and run the .msi or .pkg and follow the instructions to install
Restart after installing and confirm it is installed by typing 'node --version' or 'node -v' in the terminal */

/* Using Node REPL
REPL stands for Read Eval Print Loop. Node isn't the only language/runtime that has it.
It is just a runtime where we can write code line by line and the code is read, evaluated, printed, and repeat.
We can test it by simply writing 'node' in the terminal to open the REPL, it shows an arrow at the start of the line afterwards
We can write expressions, normal javascript lines, etc and it will run the code line by line
I can write 'let a = 5;' then in the next line I can write 'console.log(a)' and basically any JS code
We have '.help' command which gives more information, and we can quit using '.exit'
There's another way to quit, which is common to most command line applications, we can use Ctrl+C, here we need to use it twice */

/* A REPL is fun but we might want to actually run a full fledged JavaScript application here. We can use the node runtime to do that.
first we need to type 'cd' in the terminal and either write the full location, or just drag the folder to the terminal and it is auto inserted
Then we can use 'node <filename>' to run the file. Let us write a simple program and run it that way: */
console.log('This is a Node program');
