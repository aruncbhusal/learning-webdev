// Parameters vs Arguments: Parameters are the variables inside () while defining a function
// Arguments are the concrete values passed into the function. These words are used interchangeably often, but have a difference

const startGameBtn = document.getElementById('start-game-btn');
// This line was given to us at the start

// We can create a new function for the game
//                      function startGame() {
//                          console.log('Game started');
//                      }
// To start, we want to wait for the startGameBtn to be clicked, so we do what we've done so far
//                      startGameBtn.addEventListener('click', startGame);
// Here, we're calling a function, but the function is attached to an object. this is because we can have functions inside objects

// // We can define function inside an object like
// const person = {
//     name: "Brad",
//     speak: function speak() {
//         console.log("Hi, I'm Brad");
//     }
// };
// // Similarly we can call the function with the object notation like above
// person.speak();

// Functions are objects: we can see it if we use
// console.log(typeof startGame); // <== This will not work when using expression format

// Since functions are objects, we can store it in a variable just like we did above
//              const startGame = function start() { };
// In this case, the function definition is not a statement and instead it becomes an expression which returns the function object
// The implication is that we can't use "start" to access the function, because the function is stored in the scope as "startGame"
// So since the function name is irrelevant, we can even omit it to create an anonymous function
const startGame = function () {
    console.log('Game Started');
};

// We can choose any style but when using this expression format, the functions aren't hoisted to the top, so they can't be declared anywhere
// In this case it means any code using this function must be written after this expression definition, and it won't be valid before
// While in the case of statement definition, we could define the function anywhere and use it before it is declared

// The use of anonymous functions is not only to declare unconventionally. We can instead use it in place of a function name
// When the function is only used at one place, like an event listener

// startGameBtn.addEventListener('click', function () {
//     // Since we don't have a () after the function, it won't be executed, so it's the same as writing 'name' instead of 'name()'
//     console.log('Clicked');
//     // We might not prefer this sometimes because when debugging, it just shows the function name as "anonymous"
//     // So we might not easily be able to discover the source of error
// });

// Now let's actually work on the rock paper scissors game we're trying to build here
// let's first set some constants that hold the rock paper scissors strings so that we don't have to write strings repeatedly
const ROCK = 'ROCK';
const PAPER = 'PAPER';
const SCISSORS = 'SCISSORS';
const DEFAULT_CHOICE = 'ROCK';

const RESULT_DRAW = 'DRAW';
const RESULT_PLAYER_WON = 'PLAYER_WON';
const RESULT_COMPUTER_WON = 'COMPUTER_WON';

let hasStarted = false;

// Let's have a function that takes user input
const getUserInput = function () {
    const userInput = prompt(
        `${ROCK}, ${PAPER} or ${SCISSORS} ?`
    ).toUpperCase();
    // Even though the prompt gives us a string in return, and string is a primitive type, not an object,
    // JS can treat it as an object when used with the dot operator temporarily for methods like this
    // This method converts each character in the string to an upper case character

    // Now that the user has given us their choice, we need to check if it is either rock or paper or scissors
    if (userInput !== ROCK && userInput !== PAPER && userInput !== SCISSORS) {
        alert(
            `Your choice was invalid, we have chosen ${ROCK} for you by default`
        );
        // We will otherwise return a default choice, let's pick rock as default
        // return DEFAULT_CHOICE;
        // We can just send undefined then handle it later as well
        return;
    }
    return userInput;
};

const getComputerInput = function () {
    // We have an object called Math given by JS which has a method "random" that can generate a random number between 0 and 1
    const choice = Math.random();
    if (choice < 0.34) {
        return ROCK;
    } else if (choice < 0.67) {
        // Since this condition only execcutes when the above isn't true, we don't need to specify >0.34 case here
        return PAPER;
    } else {
        return SCISSORS;
    }
};

// let getWinner = function (uInput, cInput) {
//     // We can start with the draw condition
//     if (uInput === cInput) {
//         // Since we want to return a string here, let's create constants for these as well.
//         return RESULT_DRAW;
//     } else if (
//         (uInput === ROCK && cInput === SCISSORS) ||
//         (uInput === SCISSORS && cInput === PAPER) ||
//         (uInput === PAPER && cInput === ROCK)
//     ) {
//         return RESULT_PLAYER_WON;
//     } else {
//         return RESULT_COMPUTER_WON;
//     }
// };

// We can write the function liike above, but when it comes to anonymous functions, we can instead use arrow functions
// They are written as () => {...} so we can omit the function keyword, and since we only have an if here, we can convert to ternary ops
// And make it a single line return
// When we have such a code, we can omit the curly braces and the return keyword and simply write () => expression and it returns expression
let getWinner = (cInput, uInput = DEFAULT_CHOICE) =>
    // We don't need to put the parameter with default value at the end, we can even put it at the first and the order is still respected
    // Additionally, we can even use the previous argument to manipulate later argument, like uInput = cInput === 'ROCK'? 'PAPER': 'ROCK'
    uInput === cInput
        ? RESULT_DRAW
        : (uInput === ROCK && cInput === SCISSORS) ||
          (uInput === SCISSORS && cInput === PAPER) ||
          (uInput === PAPER && cInput === ROCK)
        ? RESULT_PLAYER_WON
        : RESULT_COMPUTER_WON;
// This code works exactly the same
// When we have no arguments in the function, we need to use (), when we have a single argument we can simply write arg => {...}
// When we have more than one, we again need to enclose in parentheses as (arg1, arg2 ...)
// When a single expression exists inside the function, we can use () => expression
// It will return, but we don't need to do anything with it if not needed
// When we want to return an object we need to use: (...) => ({... : ...})
// This is because if we don't have the parentheses, the object may be misinterpreted as the function body due to curly braces

// Now the function that actually starts the game
startGameBtn.addEventListener('click', function () {
    // Since this event is executed each time the button is pressed but we only want it to happen once, let's have a boolean variable
    // It is false when game hasn't started but we make it true here, so we check if it is true, and only go ahead if it is false
    if (hasStarted) {
        return;
    }
    hasStarted = true;
    const uInput = getUserInput();
    // But the core part of the game is still remaining, we need to let the computer choose as well
    // Then we can check for who won. Let's create functions for computer choice and winner check
    const cInput = getComputerInput();
    // Let's now create another function to check who won, which takes these inputs as argument
    // const result = getWinner(uInput, cInput);
    let result;
    if (uInput) {
        result = getWinner(cInput, uInput);
    } else {
        result = getWinner(cInput);
    }
    // Using this doesn't give us an error in JS, because JS is forgiving, and it just sets the second argument as undefined
    // We can then use default values in function definition to ensure this case is handled

    // console.log(result);
    // Instead of displaying just the result, let's give a more detailed output
    let message = `You chose ${
        uInput || DEFAULT_CHOICE
    } and computer chose ${cInput}, therefore you `;
    // Since uInput is still undefined we need show either it or default
    if (result === RESULT_DRAW) {
        message = message + 'had a draw.';
    } else if (result === RESULT_PLAYER_WON) {
        message = message + 'won';
    } else {
        message = message + 'lost';
    }
    alert(message);
});

// Rest parameters
// When we don't know the number of parameters our function is going to get, we can use rest parameters
// One solution is to use an array of parameters but it is not always possible
// So if we have a function that finds the sum of all numbers given to it
const summer = (handler, ...numbers) => {
    // This is like the spread operator, but it takes all the parameters given to the function and converts to an array
    // Note: It can only be used at the end, meaning we can't have anything after it, since all the rest are included inside it
    // We can have other parameters before it as well, but we can't have two rest parameters because there is no point

    // Since functions are just objects, we can simply create a function inside a function like so
    const validateNumber = (num) => (isNaN(num) ? 0 : num);
    let sum = 0;
    for (const num of numbers) {
        sum += validateNumber(num);
    }
    // return sum;
    // if we have a handler function passed, we can simply call the handler to handle the result
    handler(sum);
};

// Instead of usingg rest parameters, we can also use another method, which is only available in functions declared with function keyword
const subber = function () {
    // Here we haven't declared any arguments but we can pass them to it, and they too can be iterated like an array
    let difference = 0;
    for (const num of arguments) {
        difference -= num;
    }
    return difference;
};

summer(sumHandler, 3, 6, 2, 'dsdj', 14, -5);
// here the sumHandler function is passed as a callback
console.log(subber(-150, 34, 25, 11, 2, 9, -3, 5));

// In the case of addEventListener, we pass a function (its address) as the parameter of the method
// It is the function to which we pass the function, to call the function. The function we pass is called a callback function
// We can add a callback function to the summer function as well, as the first parameter
// We can create the handler function and pass it to the summer function call

function sumHandler(sum) {
    console.log('The sum of all numbers is: ' + sum);
}

// Now let's create a new function that can handle both addition and subtraction
const bothHandler = (message, result) => {
    // Since this handles both, we need to handle both message and result here. We can pass the message and result from the respective functions
    // But what if we had a function that did both sum and difference and we needed to pass only the result?
    // Let's first handle this function, where we alert the user about the output
    alert(message + ' ' + result);
};

// Now for a function that does the actual operations
const bothOperator = (handler, operation, ...numbers) => {
    let result = 0;
    for (const num of numbers) {
        if (isNaN(num)) continue;
        result = operation === 'SUM' ? result + num : result - num;
    }
    handler(result);
    // Here we're only passing the result value
};

// But if we had to pass both the result, and some message text that defines what operation is called
// We can use the .bind() method, which takes two* argument, first is a 'this' keyword, then the others arguments to pass
bothOperator(
    bothHandler.bind(this, 'The sum of all is'),
    'SUM',
    5,
    6,
    2,
    14,
    'hello',
    76
);
bothOperator(
    bothHandler.bind(this, 'The difference of all is'),
    'DIFF',
    -1,
    9,
    12,
    '33', // This is also treated as a number
    -43
);
// This is useful when we want to 'pre-configure' the function arguments, when we're not the ones calling it

// It can be used in the calculator app we built earlier, by combining all the different types of calculations into a single function
// Then we can bind the parameter to the function while adding the callback to the event listener
// eg addBtn.addEventListener('click', calculate.bind(this, 'ADD'));
// This way we can expect an operation parameter in the calculate function, which is sent along with this call

// Some other methods similar to bind() are call() and apply() but they call the function immediately, so they have uses elsewhere
// I asked chatGPT and it said they are used to bind a certain value to 'this' (the current(caller's) context)
// call takes many arguments, apply takes two arguments, the second is an array of many arguments, first is obviously 'this'
// call is useful when we're calling a method which can take another object as 'this', useful when the object passed doesn't have a method
// I'll leave it at this for now, no pun intended
