/* This file wasn't necessary but I decided to make a .js file instead of .md because I want to inlcude a lot more than the intro here.
First, Javascript wasn't a thing until the 1990s, when websites used to be rendered only using HTML, and any processing had to be done by the server.
This changed when Netscape, the company behind Netscape Navigator, hired Brendan Eich to design an easy to use scripting language.
Brendan made Javascript in 10 days. It is one of the most popular programming languages, many websites rely on its functionality.
It is an interpreted language, unlike C++, Java or Swift. Its name was initially LiveScript, Microsoft tried to recreate it as JScript.
Finally the EU strandardized it as ESMAscript so JS is also known as ES and its version 6 as ES6. */

/* The initial part of the course will be done in the browser, obviously, but since I need to track the files, I will have to save them here as well
In the browser, we can use the Console in the developer options to run single/multi line code, but since it's not file based,
we instead can go to the sources, then find "Snippets" where we can add a .js file which we can run together
The first thing to learn is how to add alerts and what JS does: */

alert('Hello!');

/* From this single line, we can learn a lot. The alert is a keyword(function) in JavaScript which has a certain meaning/functionality
It follows the Javascript grammar. The message "Hello!" is shown to the user by JavaScript because we used the keyword alert
The statement ends in a semicolon, and the message is enclosed in parentheses as a part of the JavaScript grammar.
We can add blank/white spaces between the items here, but the best praactice is to keep it all tight */

//  alert ( "Hello! " ) ;

/* This too will give the same output, but we prefer the one above. Also we can use either " or ' to enclose the message,
but for this scenario, we generally prefer using ". The best practices for JavaScript can be inferred from here:
https://github.com/rwaldron/idiomatic.js */

/* This line simply pops out a dialogue box with the message and has an OK button which lets user acknowledge the alert.
We can read more about the keywords and functions in Javascript on the Mozila Developer Network website
https://developer.mozilla.org/en-US/docs/Web/JavaScript
This alert function is actually window.alert() but we often just use alert() */

/* The "Hello!" inside quotes is not a part of the code but instead text that needs to be handled differently. It is called a "string"
The string is one of the data types in JavaScript. Some other data types are number, and boolean. These don't need quotes.
The boolean is used for true or false values. We can use the following to check the data type of something: */
// typeof("Name");
// Commenting this out because JS now doesn't require parentheses for typeof string and boolean
typeof (4 + 5); // We can use expressions as well.
// typeof(false);

// Variables
/* When we need to tell something multiple times, we don't want to keep telling the computer what it is we're talking about
We want to ensure it understands from memory what we're talking about. In order to have the data in memory, we need to have a container for the data.
We can use the following command to create an alert style dialog box where we can enter something and press ok */
prompt('What is your name?');

/* In this line, prompt is a keyword and we're giving it the text "What is your name?" to display
We can store something in memory by assigning the value to a "variable" */
var person = 'Brad';
/* In this line, the var keyword is used to create a container in memory. The name of that container is "person" and it has the content "Brad"
We can then write person on the console and it would give us "Brad" because it is stored in the memory
We can also use: */
person = 'Stacy';
/* This way we can modify the contents of the variable. Notice that we don't need to use 'var' when using or modifying the variable
A variable only needs to be declared once, and it can be done using the var keyword */

/* A challenge was to display the name of the person as a part of the alert message, without using any stirng.
Since this is an introduction class, I think I'll just power through it. */
alert(person);

/* We can also store the data we got from the user, like the prompt above. We can store the value into another variable */
var yourName = prompt('What is your name?');
/* Now that the data entered is stored inside the variable yourName, we can simpyly use it inside another alert, also combining with other text */
alert('Hi I am ' + person + '. Nice to meet you ' + yourName);

/* There's a coding exercise but I can't see the link so I just copied it here:
Our task is to swap the values from one variable into another variable, basic programming challenge*/
function test() {
    var a = '3';
    var b = '8';

    /* ********** Do not change the code above ***** */
    //Write your code on lines 7 - 9:
    var temp = a;
    a = b;
    b = temp;

    /* ********** Do not change the code below ****** */

    console.log('a is ' + a);
    console.log('b is ' + b);
}
/* Apparently we weren't expected to solve it, but look at the solution and learn instead
And in her solution she used a variable name c instead, I've just gotten too habituated with using temp. */

// Naming Conventions
/* We can give any name to a JavaScript variable, but it doesn't mean we should. The name we give to a variable should convey what the variable will hold.
Storing someone's age inside a variable called 'name' is confusing, and we should avoid doing so
But by any name, we don't mean ANY name, we are bound by some rules:
1. The name of the variable can't be a keyword:
var var = "Me";
This is not valid, because var is already a keyword
2. The name of a variable can't start with a number. This is not valid:
var 123thing = true;
3. The name of a variable cannot have any special characters apart from letters, numbers, $ and _ so these are invalid:
var my name = "Musk";
var my.name = "Harold";
var my-name = "Gwen";
*/

// But we CAN do the following things:
// 1. The name of a variable CAN contain a keyword anywhere
var various = 'Some';
// 2. The name of a variable can have a number anywhere else
var i8appl3 = true;
// 3. The name of a variable can have $ and _ as special characters
var my_name = 'Sophie';
// 4. The naming convention for JS variables is camelCase, where all words after first word start with an uppercase letter
var myName = 'Brian';

// String Concatenation
/* We can use + to join two or more strings together, and it will create a new string by the method of concatenation. For example */
'Adam' + ' and ' + 'Eve'; // This gets concatenated into "Adam and Eve"

/* Note: We can clear the console using Ctrl+K. But this doesn't clear any variables we may have declared. For that we need to clear cache.
We can do that by right clicking on the reload button, and press Clear cache and hard reload. */
/* A task here is to create an alert using variables and strings, and concatenating them into a greeting message */
var message = 'Hello';
var user = 'Monica';

// In order to alert the user with "Hello there, Monica" I will need to place the spaces inside the text part, since there are none in given variables
alert(message + ' there, ' + user);

// String Length
/* A string has property called length which can be used as stringname.length in order to retrieve the number of characters in that string
Based on this property, we have a challenge to create a twitter character counter, which has a limit of 140 characters
The user enters the string in a prompt and we are to tell the user how many they've written and how many they've got left. */
var tweet = prompt("What's on your mind?");

alert(
    'You have written ' +
        tweet.length +
        ' characters. You have ' +
        (140 - tweet.length) +
        ' characters left.'
);
/* The solution probably has another variable which has 140-tweet.length but I'll just use it raw
She used a variable to store tweet.length, then did what I did for the 140-length part. Also she mentioned not using the var as well.*/
// Finally a way to comment was introduced in the code at this point. This one for single line comment
/* And this one for
   multi line comment */

// Slice
/* We can comment lines by selecting them and pressing Ctrl+/
The Javascript slice function can be used to slice a string, which is basically a "string" of characters and pick the slices
It has two values start and end. A string starts from the value 0. The character at the end value's posiiton is not included in the slice
We can use the slice function to get the desired character or slice from a string like: */
var someString = 'This is a string.';
someString.slice(0, 1); // This takes the characters from the first(at 0) to ...first(at 1 - 1 = 0) so returns "T"
someString.slice(1, 4); // This takes characters from second(at 1) to fourth(at 4 - 1 = 3) so returns "his"

/* Now our challenge is to slice the string that the user gives in his prompt and give the new sliced string as an alert */
var newTweet = prompt('Post a tweet!');
alert(newTweet.slice(0, 140)); // This should take the first 140 characters from the string
/* Of course the course solution had the value to be shown in a new variable but she did include my solution as well
She also showed a one-liner, which I avoided on purpose, by eliminating the newTweet variable and putting the prompt inside the alert itself */

/* There are also ways to convert a string into all upper case or all lower case using toUpperCase and toLowerCase */
var someName = 'WiLbur';
someName.toUpperCase();
someName.toLowerCase();

/* Now our challenge is to take a name as input using prompt, then capitalize the first letter and the rest should be lower
I wonder what the course solution is, but my solution is to do this (using only things brought up so far): */
var inputName = prompt('What is your name?');
var properInputName =
    inputName.slice(0, 1).toUpperCase() +
    inputName.slice(1, inputName.length).toLowerCase();
alert('Hello, ' + properInputName);
/* Though I feel like this level of thinking is a bit hard for someone who has probably only spent 3-4 hours with javascript/programming
it would be fun to see what she was expecting from the course takers */
/* Course solution: It split everything I did for properInputName into multiple lines
First line stores first character of name into a variable, second capitalizes it, third takes rest of characters, fourth concatenates
The line for conversion of the rest of the name into lowercase was added later as an optional bug fix for non lower case later character input */

// Arithmetics
/* In order to perform mathematical operations, we can use + for addition, - for subtraction, * for multiplication and / for division
We can use % for modulo division, which gives us the remainder when a number is divided by another. Here */
9 % 4; // This expression evaluates to 1 because that is the remainder when 9 is divided by 4
// It is useful in many cases, like when testing for odd or even we can use number % 2, and number is odd if the result is 1, and even if 0
/* When we have a mathematical expression, like 4 + 5 * 6 they are evaluated based on the precedence.
The priority is multiplication/division before addition/subtraction. We can use parentheses to give higher precedence. */

/* A challenge here was to create a dog year to human year converter, with formula already given. Should be simple enough */
var dogAge = prompt('How old in dog years?');
var humanAge = (dogAge - 2) * 4 + 21;
alert('The human age is: ' + humanAge);

// Another way of arithmetics
/* In normal math we have expressions like a = b + c, but in programming the following is valid as well: */
var x = 2;
x = x + 1; // Now x = 3. The new value of x is the old value of x plus 1
/* We can also write this in a different way to make this increment easier: */
x++; // Now x = 4. This operator is called the increment operator
/* We can also use x-- for decrement */
/* If we want to increment by any value other than 1, we can use the following: */
x += 2; // Now x = 6
/* Similarly, we also have -= for decrement, *= for multiplication, /= for division */

// This is already approaching 200 lines so the next part will be in another file.
