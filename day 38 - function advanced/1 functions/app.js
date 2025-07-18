// Pure Functions and Side Effects
// A function is said to be pure if for the same input, it always produces the same output, and doesn't have any side effects
// A side effect is any change outside the function induced by the function

// An example of a pure function is a function that simply adds two numbers or returns a new string
const testString1 = 'Cat';
function addFantastic(text) {
    return 'Fantastic ' + text;
}
console.log(addFantastic(testString1));
// This produces the same output each time we run it, and doesn't affect anything outside the function

// An example of an impure function would be when we use a random value inside the function
function randomValue(num) {
    return Math.random() * num;
}
console.log(randomValue(5));
// This gives us a random number between 0 and 5, the result is different each time so it is impure

// This is an impure funciton as well
let defaultValue = 10;
function addNumber(num) {
    return num + defaultValue;
}
// It is because defaultValue, which we haven't passed to the function, may change, changing the output of the function even for same input

// A function is also impure if it has side effects, that might be some HTTP response or some value
let addReference = 5;
function addToReference(num) {
    addReference += num;
    return addReference;
}
console.log(addToReference(4));
// Here the value of addReference was changed so it has side effect and it is not pure

// Another case of side effect is when we change an array or object
const tasks = ['pick up the trash', 'study for exams'];
function addTask(task) {
    tasks.push(task);
    return tasks;
}
console.log(addTask('Cook dinner'));
// This changes the tasks array so it is an impure function

// In an ideal case all functions should be pure without side effects, but practically it is not possible,
// We should instead aim to maximize pure functions and avoid side effects as much as possible

// Factory function
// It is a function used to create other functions
// Sometimes we may need to create a subfunction for a process rather than using a big function for everything
// If we have a tax calculator, we might need to pass the tax percentage each time we run the tax calculator
// To avoid that, we can use a factory function to create functions for each tax categories with their own tax percentages
let multiplier = 1.1;

function createTaxCalculator(tax) {
    function taxCalculator(amount) {
        console.log(multiplier);
        return amount * tax * multiplier;
    }
    return taxCalculator;
}

const vatCalculator = createTaxCalculator(0.13);
const incomeTaxCalculator = createTaxCalculator(0.28);

multiplier = 1.2;

console.log(vatCalculator(1500));
console.log(incomeTaxCalculator(45000));

// Closures
// Every function in Javascript is a closure i.e. it closes over the inner environment
// The code enclosed by the curly brackets is the lexical environment, where the function is in scope, but outer environment is global
// Inside a function, we can access the variables declared outside of the function but not the other way around
// Similarly if we have a function inside the function, it has its own lexical environment but can access the values outside it
// In the above example we can see that multiplier was changed from 1.1 to 1.2 AFTER the functions were created,
// but since the function has access to that variable from inside the function, it uses the latest value at the time of being called
// Similarly when we create the tax calculator functions, we pass the tax, which is not used inside the createTaxCalculator function
// In JavaScript, but not many other programming languages, the value is kept there in case a closure inside might access it
// In this case the taxCalculator function which is a closure over the createTaxCalculator, can access the variable tax
// If it had changed, the changed value would be reflected, but since it is not, the value will be retained
// Also, every function in Javascript behaves this way, being able to access the variables that are outside the function, so all are closures

// An example would be using a variable that changes before calling but after function declaration
let userName = 'Gary';
function greet() {
    let name = userName;
    console.log('Hello ' + name);
}
userName = 'Tom';
greet();
// In this case, the function greet has its own lexical environment, and it also has an external lexical environment
// The outer environment has a variable userName which is referenced inside the function so the function uses a pointer to that variable
// This means that when we change the value of the variable and call the function, the value that the pointer points to has changed
// So the value inside name will be the newly changed value since it only stores the reference and not the actual value
// We can say that functions remember the surrounding environment and react to changes to it if it affects it

// We can imagine that storing all these references might be bad for our memory because what if we create a variable, never use it after once
// But it still takes up space in the memory because something might use it inside a function or something else with its own lexical environment
// Even if statements and loops, because of the curly brackets, have their own lexical envs
// JavaScript engine optimizes for memory performance by removing these valuesif it is sure that no entity is going to use them

// IIFE (Immediately Invoked Function Execution)
// In the olden days of JavaScript (before ES6), code like the following was common:
(function logAge() {
    var age = 15;
    console.log(age);
})();
// console.log(age); // Would throw an error
// This is an example of a function that gets executed immediately, and we need to enclose it with parentheses because
// we can't execute function declarations directly. It was used during the days of var because var has a function scope
// This means that if we needed a temporary variable which we only want for a certain portion of the code, we need to have a function
// So we could use an IIFE to limit the scope of the variable to a specific portion, since due to closures it could access outer variables
// Nowadays it is not required because we have let and const which are block scoped so we can just do {} and put the code between these

// Recursion
// This is not exclusive to JavaScript and is a part of basically all programming languages
// Suppose we have a function to calculate the power of a number, we could write it this way:
function powerOf(x, n) {
    // Here x is the base and n is the exponent
    let result = 1;
    for (i = 0; i < n; i++) {
        result *= x;
    }
    return result;
}
console.log(powerOf(2, 3));

// But the following function can be used to do the same thing:
function recursivePowerOf(x, n) {
    // if (n === 1) {
    //     return x;
    // }
    // return x * recursivePowerOf(x, n - 1);
    // We can also write this as:
    return n === 1 ? x : x * recursivePowerOf(x, n - 1);
}
console.log(recursivePowerOf(2, 3));
// In this case the function will call another instance of the function which has a different value, until we reach a value
// from which we can return a normal value instead of a function call
// if we look at the debugger and inside the call stack, we can see that for each function call, the function is added to the call stack
// And this function is called multiple times so we can see each call with their respective values of x and n, until n reaches 1
// And then the functions are removed from the call stack one by one

// We can see that recursion saved us some lines of code, and we wrote the power function in a single line
// Apart from that it can let us solve a problem that we might not have beenn able to with a for loop
// Since in a for loop we know how many times we want to do something, we can't work with data where that is unpredictable
// For example, let's say we have a nested array:
const network = [
    {
        name: 'John',
        network: [
            {
                name: 'Julia',
                network: [
                    {
                        name: 'Sid',
                    },
                ],
            },
            {
                name: 'Chris',
                network: [
                    {
                        name: 'Tina',
                        network: [
                            {
                                name: 'Gwen',
                            },
                        ],
                    },
                ],
            },
            {
                name: 'Miley',
            },
        ],
    },
];
// Here we have an array of objects, each with a name and a network key, the network itself has a similar object inside
// Some have network, but some don't, so those who don't are the last part of a network tree
// In order to work with such a value with a loop would be tiresome because we would need to nest multiple loops,
// We don't want to deal with hell while looping over something, so we can instead use recursion here
function displayNetwork(person) {
    const allNames = [];
    // In order to return, we must store all names

    if (!person.network) {
        return [];
        // If a person doesn't have any network we have no further to go, so we can return an empty array
    }
    for (const p of person.network) {
        allNames.push(p.name); // We need to first push the current person's name to the array, then we move to their network
        allNames.push(...displayNetwork(p)); // Since we're adding array to an array, we can do it using spreading
    }
    return allNames;
}
console.log(displayNetwork(network[0]));
// When we reach the end it gives an empty array, then the arrow keeps building until above, where there may be contacts
// In this case, the array inside the function keeps growing, pushing from depth to surface, ensuring all names are covered
// This is it for today I think, short one but useful
