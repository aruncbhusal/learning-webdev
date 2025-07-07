// This file was created by me, the vendor.js was not. The first thing that was covered was the alert, as usual
// Variables and Constants: Both are data storage containers. Variables are created with keyword let, constants with const.
// A variable can be reassigned to another value, no need to use let at that time, but const cannot.
// We should use const whenever possible because it conveys our intent that we don't want the value to change.

// Let's create a variable now
let currentResult = 0;
// There are rules when naming a variable, we can use letters and numbers and some special characters in the name, but
// Starting with a number is not allowed, starting with $ and _ is allowed. Characters like - and whitespace are not allowed
// Using camelCase where first word starts lowercase, second upper, is best practice, snake_case is not recommended
// Also we can't use keywords as variable names so that we don't confuse the compiler
// We can leave a variable uninitialized (without using = value), or we can initialize it.
// The semi-colon is optional but it is good practice to be consistent with the usage

// Expressions: The right hand side executes before the left.
currentResult = (currentResult + 10) * 3;
// We can assign an expression to the variable and use operators like + - * / ** and we can control the order using parentheses
// Here we assign the expression involving previous value of current result to new value using the assignment operator =
// We can then use it with this to change the html page result section
//                                  outputResult(currentResult, '');
// This takes the two data we put inside the parentheses, and calls the function in vendor.js which modifies values in the html

// Data Types: Numbers are the data types that can be used with mathematical operators, Strings are texts which must be enclosed
// The strings may be enclosed with ' or " or ` and in the line above, we use '' to represent an empty string
// We're giving two values because it modifies two parts of the html, we can also create a string variable to send
let resultText = '(' + currentResult + ' + 10) * 3';
// Here we are using string concatenation, where we can join strings with the + operator and we use this because if we don't,
// the currentResult variable would be treated as a string, so it must not be enclosed.
outputResult(currentResult, resultText);

// We can also assign a variable another variable, and since code runs from top to bottom, the most recent value will be used
const constant = 0;
let variable = constant;
variable = 4;
// In this case we're copying the value in constant and creating a variable then we reassign the variable
// If we try to reassign the constant, we get an error, which we can see by opening browser's developer tools

// Strings
// We can enclose strings between single, double quotes or backticks, and we must always end a string once started
// We can print ' inside a string by using " to enclose the string, and vice versa. Strings are inside, but expressions outside
// When using backticks ` we can use template literals i.e. we can put expressions inside string by putting inside ${}
resultText = `(${constant} + 10)
                             * 3`;
// We can see that this string can span multiple lines, and have whitespace, which strings with ' and " can't
// We can show the white spaces in html using white-space: pre; property in css
// We can add line breaks inside strings with ' or " using \n where the backslash escapes the next character
// If we need to show ' inside a string enclosed with ' we can use \n. To show \ we can use \\

// Functions
// We can define functions using: function functionName(parameters){code}
// After we define the function, like outputResult function in vendor.js, we can use it anytime with different parameters
// It is called "calling" the function, where we pass parameters and the values in those parameters can be used by the function
// Let's create a function for adding two numbers
function add(num1, num2) {
    // We can define a function anywhere and execute it anywhere because during executions they are detected before other code
    const result = num1 + num2;
    // We can create a constant/variable inside a function, called local scope, or outside at the beginning, called global scope
    //                      alert('The result is: ' + result);
    // This function is a built in function from the browser which takes a string parameter which we pass by concatenating

    // We can instead delegate a task to a function and then return the result of the function back
    return result;
    // In this case, we return the value inside the result variable using the return keyword
    // When we use return, the function execution ends there, and any code after is discarded/not used
}
currentResult = add(1, 5);
// Now we can call the function. Not all functions need parameters, but we can define them when creating the function
// Since our function returns a value, we can store the value inside a variable.

// Syntax errors: writing in a way you're not allowed by the program i.e. function newFunc {} misses the () after name
// Whitespace, line breaks and indentations are optional apart from between keywords/names , but we use them for readability
// We can split a long expression into multiple lines for simplicity, by not ending the current line i.e. ending with + to continue next line

// Challenge: subtract and stringify functions. Stringify should take a number then return a string with the number in it
function subtract(num1, num2) {
    // const result = num1 - num2;
    // return result;
    // We can shorten these lines to simply
    return num1 - num2;
}

function stringify(num) {
    // const result = 'Result: ' + num; // Could use concatenation
    const reresult = `Result: ${num}`; // or template literals
    return reresult;
}

// Code order: We can't use a variable/constatnt before it is declared. We don't need to initialize it but using before declaring causes error
// But for functions, there is no error because the code is aware of the functions, and then it starts executing the rest

// We can access global scope variables/constatnts inside the function, but we can't access local/block scoped ones outside
// It is best practice to use local variables as far as possible and not modify global variables from inside a function
// The scope of a block scoped variable is between curly braces
// We can't declare the same variable twice, inside the same scope, but if we do it in different scopes, it is allowed
// Shadoowing: If a variable/constant exists in global scope, we can declare it in local scope and it will be the one used inside
// The value of the variable/constant inside the function lasts only within the function, then it retains the global value

// We can also execute the functions indirectly, without calling it ourself.
// It can be done using a browser given function for which we need to use the add button variable in vendor.js
addBtn.addEventListener('click', addNumber);
// In this line, I call the addEventListener function, and send two parameters, one is the string which describes what happened
// The next is a function name. If we call the function here, the engine will call it while parsing, which is not what we want
// By only giving the function name, we allow the engine to call the function when the button is clicked
let currResult = 0;

// We can declare an array by putting elements separated by comma
let logs = [];
// In this case we're creating an empty array, if we wanted to add elements we would need to put things inside the brackets

function logOutput(operator, initialNumber, userInput) {
    const calcDescription = `${initialNumber} ${operator} ${userInput}`;
    outputResult(currResult, calcDescription);
    // Since currResult is a global variable we can simply use it here

    // Let's make use of the array here, each time the button is pressed, we're storing the operator here
    // We can reassign it like logs = [operator] since it is a variable, but we don't want to override array
    // We instead want to add more elements. So we use a function of this array called push
    //                          logs.push(operator);

    // We can also create objects to group together multiple data, like all the things involved in an operation
    // We might want to store a log each time so we can use an object, enclosed by curly braces, each key-value pair separated by comma
    // We use this indentation and line break style to make reading the object easier.
    const log = {
        symbol: operator,
        prevValue: initialNumber,
        nextValue: userInput,
    };
    // Note: key is assigned a value using colon, not equal, and we have semicolon after object definition
    // Finally we can push the log to the array
    logs.push(log);

    // Now we can look at this array using a tool that is used very often
    // We can use console.log() to display some value in the developer console, it is a built in function
    console.log(logs);
    // We can show the entire array this way, but what if we want a single element from the array? We can use indexing
    // In an array, the indexing starts from 0, so first element is at index 0, second at 1 and so on
    // If we try to use 5 when there are 5 elements, the result will be undefined because there is no 6th element
    // To show the 3rd element: console.log(logs[2]);

    // Similar to arrays, we can also access the values in an object, for it we use the dot notation. For example
    // console.log(log.operator);
    // This would give us the value of operator for this log object. operator is a property of the log object
    // When we use addEventListener, we are not accessing a property but instead calling a function. Objects can have functions
}

function addNumber() {
    // const userInp = parseInt(userInput.value);
    // This way we've taken a value and used in in multiple places, and now all changes can be handled from here
    // But we can take this further, by creating a new function that returns this value, and storing the result here
    const userInp = getUserInp();

    // We can create a constant here that stores the expression as a string
    //                      const calcDescription = `${currResult} + ${userInput.value}`;
    // We can then send this to the ourputResult function, and the string interpolation will convert any numbers to string implicitly
    // But we have repeated userInput.value in two places. We don't want to repeat code because it makes our code messier
    // And when we make changes to one thing, all the things that use it must be changed.
    // So we can create a new constant to store the value for user input
    //                      const calcDescription = `${currResult} + ${userInp}`;
    // We can use this but our function is doing multiple things and we want all of our functions to do this
    // So we can separate this into another function, but since we still need to store the initial number before operation
    const initialNum = currResult;

    // Since we can't pass any arguments, we will make use of global variables
    // Using global variables here is okay because we're intentional and this function serves to work with them without anything rogue
    //                      currResult = currResult + userInput.value;
    // We're taking the input variable from the vendor.js and since it just points to the input element, we need its value
    // This line doesn't produce desired result because the value in an input field is always a string, even for number type
    // So we need to convert it into a number, we can use parseInt(text) or parseFloat(text) to make the conversion
    // But it only works for strings that are numbers. We can also convert to string using number.toString()
    //                      currResult = currResult + parseInt(userInput.value);
    // Using parseInt gives us a number without decimal places, using parseFloat gives us number with decimals
    // JavaScript understands 5 - '5' or 5 * '5' or 5 / '5' as math, but treats 5 + '5' as string concatenation
    // This is because + can be used for both, while other operators can be used only for arithmetic operations
    //                      currResult = currResult + userInp;
    // While this is totally valid, we can use shorthand when we're trying to assign a number by adding to itself
    currResult += userInp;
    // Using this is the same as the above line. Similar assignment operators exist for subtraction, multiplication and division

    //                                         outputResult(currResult, '');
    // Since we also need to change the content of the html when clicked, we need to call this function inside this function
    // We want to add the expression we just evaluated as the string to be passed to the function, but current value has already changed
    // So we need to create a constant before the change happened so that we store the value
    //                                         outputResult(currResult, calcDescription)
    // The purpose of this line is to log the result to the html and we want all operations to do this, so we separate into a function
    // I'll define the function above this one, and pass it the parameters as per the definition
    logOutput('+', initialNum, userInp);
}

function getUserInp() {
    return parseInt(userInput.value);
}

// Challenge: Create a function "double" and "transform". Transform should take a function input and use it to transform number
function double(num) {
    return num * 2;
}
function transform(num, action) {
    return action(num);
}

// Now similar to addNumber, we can create functions for the rest of the buttons
function subtractNumber() {
    const userInp = getUserInp();
    const initialNum = currResult;
    currResult -= userInp;
    logOutput('-', initialNum, userInp);
}
function multiplyNumber() {
    const userInp = getUserInp();
    const initialNum = currResult;
    currResult *= userInp;
    logOutput('*', initialNum, userInp);
}
function divideNumber() {
    const userInp = getUserInp();
    const initialNum = currResult;
    currResult /= userInp;
    logOutput('/', initialNum, userInp);
}
// Now we can also ensure each function is executed when their button is pressed by taking the button from vendor.js
subtractBtn.addEventListener('click', subtractNumber);
multiplyBtn.addEventListener('click', multiplyNumber);
divideBtn.addEventListener('click', divideNumber);

// Finally comments were covered. In this file so far I've been using single line comments
// In fact I can even write comments after a line of code
const aNewVariable = 'New value'; // A new variable
// Comments are used to brifly add context, clarify meaning, or document code
/* We can also have
multiline comments

which span across multiple lines
These comments are not executed with the rest of the code. */

// Similar to the += -= operators, we also have increment (++) or decrement (--) operators
variable++; // This adds 1 to the value of variable and assigns it to variable, it returns the initial value of variable
variable--; // Similar to ++, it decreases 1 from variable, and returns original value of variable
// The returning makes a small difference because we can also use the followings for the same effect:
++variable;
--variable;
// The main difference is that when using operator before, it first operates on the variable then returns the value
// When using after, it returns the value, then operates on the variable

// Apart fromm numbers and strings, we have other important data types:
// Booleans: These store only two values: true or false, they are useful with conditionals
// Objects: enclosed within curly braces like {name:"Gary",age:19} and stores key value pairs, used to group related values together
// Arrays: They are lists of numbers, strings, objects or other arrays

// Using arrays: We can use arrays to store a list of items that should go together. Let's define a new array before these functions

// Special Types: undefined, null and NaN
// undefined: It is a data type and a value. It is the default value for variables not yet initialized/created. We should not assign it to anything.
// null: It is similar to undefined, but it needs to be assigned and is never assumed by default.
// NaN: It is not a type because its type is a number, it is a result of attempting mathematical operations with non numbers, like 2 * "wow"
// Since it is treated as a number, the operation of a number with NaN results in a NaN (Not a Number)

// typeof: We can use the keyword typeof with an entity to get the type of that entity at run time
// Notable types: all numbers are "number", array is object, undefined is undefined, null is object and NaN is number
// An array and null are both special types of objects
