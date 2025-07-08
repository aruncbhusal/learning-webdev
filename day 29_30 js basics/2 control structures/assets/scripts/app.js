// This time we're beginning with the final code from the last module on basics.
// Control structures include conditional statements like if, which let us execute different code based on a condition
// and loops, which let us execute a block of code multiple times based on a condition.

// Conditional Code Execution
// In programming, we often want to execute a block of code when a condition is met, and another when it is not
// This is done by a core programming concept called if statement. It is used as if (condition) {code}
// The condition is a boolean i.e. is either true or false. But it is not possible to always have a boolean variable that stores it
// So we have boolean operators, aka comparison operators which return a boolean value. Some such operators are
// == and != which help us check if two values are equal. eg. a == b is true if a=2 and b=2 but a != b is false in that condition
// === and !== help us check equality of values AND type. 2 == '2' is true but 2 === '2' is false. We should prefer this over == or !=
// Checking for type equality makes us more intentional and responsible about types of compared values and write less error prone code
// We also have other comparison operators like < (less than), > (greater than) and <= , >= which are true for < , > as well as ===
// With this in mind, we can refactor the functions for operations below to make them call a single function that handles it all

// Comparing objets and arrays
// When we compare two identical objects or two identical arrays, we get the result false
// eg {name: "ABC"} == {name: "ABC"} is false, same with ===, also ['a','b'] == ['a', 'b'] is false, same with ===
// Arrays are type of objects so that explains why both act this way, but two objects are not equal because of how they're stored in memory
// Note: when we set person1 = {name: 'A'} then person2 = person1, then person1 == person2 is true, and person1.name == person2.name too

// Combining Conditions
// We can use the logical AND and OR operators (&& and ||) to combine operators. when we use if (a && b || c) {}
// It means the code runs if a is true AND b is true, or c is true. If either of a or b is false, the overall can be true is c is true
// but if c is false then both a and b must be true. We can use parentheses as a && (b || c) to mean that either b or c should be true
// but int his case, a must always be true for the overall condition to be true
// We can now use this in our function

// Operator Precedence
// It is the order in which the operators are executed. Since we have a lot of different types of functions producing different outputs, this is important
// We can visit MDN page for operator precedence: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_precedence
// The higher operators have greater precedence, like () has the highest precedence, so we can use it to override precedence of others
// Arithmetic operators retain the mathematical rules of precedence, boolean operators are lower precedence than arithmetics
// 1 + 2 < 3 + 4 is evaluated as 1+2, 3+4 and then 3 < 7. Similarly boolean operators take precedence over logical as well
// && has higher precedence than ||, which is why a && b || c is true even if a is false, but c is true

// Falsy and Truthy values
// Conditions require booleans, or expressions that evaluate to a boolean, like a comparison, but what if we simply give it a value
// JS tries to coerce the value into a boolean, so that the condition is always either true or false
// For numbers, 0 is falsy, anything else, including negative numbers is truthy so if (-4) executes the if block but if(0) doesn't
// Similarly an empty string '' is falsy, but any non empty string is truthy. All objects and arrays, empty or not are truthy
// Special ones like undefined, null and NaN are falsy
// Let's make its use in the calculate function

const defaultResult = 0;
let currentResult = defaultResult;
let logEntries = [];

// Gets input from input field
function getUserNumberInput() {
    return parseInt(usrInput.value);
}

// Generates and writes calculation log
function createAndWriteOutput(operator, resultBeforeCalc, calcNumber) {
    const calcDescription = `${resultBeforeCalc} ${operator} ${calcNumber}`;
    outputResult(currentResult, calcDescription); // from vendor file
}

function writeToLog(
    operationIdentifier,
    prevResult,
    operationNumber,
    newResult
) {
    const logEntry = {
        operation: operationIdentifier,
        prevResult: prevResult,
        number: operationNumber,
        result: newResult,
    };
    logEntries.push(logEntry);
    console.log(logEntries);
}

// We can define a function that handles all operations here
function calculateResult(operation) {
    const enteredNumber = getUserNumberInput();
    // What if we pass an operation that isn't ADD, SUBTRACT, MULTIPLY or DIVIDE? We can check for it by combining conditions
    if (
        (operation !== 'ADD' &&
            operation !== 'SUBTRACT' &&
            operation !== 'MULTIPLY' &&
            operation !== 'DIVIDE') ||
        !enteredNumber
    ) {
        // Since we don't want to divide or multiply when user input is 0, and we can choose to not add/subtract either when 0
        // We can also add another condition for enteredNumber === 0, but we can also write it as !enteredNumber
        // Since 0 is falsy, enteredNumber is false when it is 0, to make it true, we can use its negation, so the ! before it

        return;
        // This condition is met when operation is neither of the permitted strings, then none of the function below is run
    }

    // We can also write this with the OR operator, by using the equality rather than inequality operator
    if (
        operation === 'ADD' ||
        operation === 'SUBTRACT' ||
        operation === 'MULTIPLY' ||
        operation === 'DIVIDE'
    ) {
        // We include the rest of the function here, but since this is less clean,
        // having to wrap around the rest of the code, we prefer the above approach
    }

    const initialResult = currentResult;
    // currentResult += enteredNumber;
    // Instead of only adding, we can check the operation using if statement

    let mathOperator;
    /*
  if (operation === 'ADD') {
    currentResult += enteredNumber;
    mathOperator = '+';
  } else {
    // We can add an else statement to be executed when the operation is not add
    // When calling from the subtract function, we send 'subtract' which is not equal to 'add' so this will be executed
    currentResult -= enteredNumber;
    mathOperator = '-';
  }
  */

    // But we don't have only two options here, we have more. We can put them inside the else block as nested if statements
    // but when we have multiple of those conditions, it becomes deeply nested and hard to manage, so we instead use else if
    if (operation === 'ADD') {
        currentResult += enteredNumber;
        mathOperator = '+';
    } else if (operation === 'SUBTRACT') {
        currentResult -= enteredNumber;
        mathOperator = '-';
    } else if (operation === 'MULTIPLY') {
        currentResult *= enteredNumber;
        mathOperator = '*';
    } else if (operation === 'DIVIDE') {
        currentResult /= enteredNumber;
        mathOperator = '/';
    }
    // This code doesn't get executed if none of the if statements are true, but if we want to execute something, we can add an else
    // after all the else if blocks have been written. This way we replaced all the redundant functions with just this conditional block
    // Also the lower block only runs if the upper isn't true, i.e. if the operation === 'ADD' is true, it runs the if block,
    // But it doesn't check the next else if. Only if current one is false does it check the next one
    // Only one block is executed

    createAndWriteOutput(mathOperator, initialResult, enteredNumber);
    writeToLog(operation, initialResult, enteredNumber, currentResult);
}

function add() {
    // const enteredNumber = getUserNumberInput();
    // const initialResult = currentResult;
    // currentResult += enteredNumber;
    // createAndWriteOutput('+', initialResult, enteredNumber);
    // writeToLog('ADD', initialResult, enteredNumber, currentResult);

    // We can remove all the lines that were here previously and simply call the calculateResult() function
    calculateResult('ADD');
}

function subtract() {
    calculateResult('SUBTRACT');
}

function multiply() {
    calculateResult('MULTIPLY');
}

function divide() {
    calculateResult('DIVIDE');
}

addBtn.addEventListener('click', add);
subtractBtn.addEventListener('click', subtract);
multiplyBtn.addEventListener('click', multiply);
divideBtn.addEventListener('click', divide);
