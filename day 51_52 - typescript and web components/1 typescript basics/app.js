// TypeScript is not a language you'd run on a browser or NodeJS but instead it is another language that can be compiled to JS
// It adds features to JS and makes development easier
// TypeScript builds up on JS, and is called a "superset" of JavaScript, which can be compiled to JS using specific tools
// One of the biggest additions it makes it static types. JS is a dynamic weakly typed language i.e. types are defined at runtime
// But in TypeScript, everything must have a fixed type
// In order to work with typescript we need to install the compiler for it
// We can visit https://www.typescriptlang.org/ for docs or instructions
// To install TS Compiler globally we simple use npm install -g typescript
// This installs it globally on our system, and we need npm (Node package manager) to install it
// After installation, we can create a .ts file but we need to write .js in the script tag since .ts can't be run on browsers
// In order to compile our TS Code to JS, we can use 'tsc <filename>.ts'  to convert to a js file
// In the add function, we may get strings or other types as parameters, while JS will just break the code, or produce a bug
// In the case of strings, it may concatenate them, which we don't want, but in TS we can specify types so it throws error
// Since the data types are fixed during compile time
// Also another feature added by TS is the ability to compile into "old JS" so that the code works on older browsers as well
function add(a, b) {
    // Here, we're defining a and b to be numbers and if we pass anything else, VS Code has inbuilt syntax highlighting to let us know
    // Or we can try compiling which gives an error directly.
    return a + b;
}
// But that isn't the only way we can work with types in TS, for instance in the next line here
var result = add(5, 3);
// The constant 'result' can also be assigned a type with const result: number since we're storing a number there
// But it isn't necessary in this case because TS has Type Inference where it knows what type we're working with
// Here, since the add function takes two numbers and returns their sum, it too must be a number, so the result constant should be a number
// If we instead use :string then it shows an error unless we convert the result to string
console.log(result);
// We also have function types, which are the types that can be returned from the function
// In the above function, we could also define it as function add(a:number, b:number): number
// This way we know that we're returning a number and get error otherwise, but it too can be inferenced so we don't need to use it
// What if our function has no return?
// What if we want to work with any type of parameter?
function printThing(thing) {
    // In order to work with any type of parameter, here thing can be any type, we can use :any
    // But by using this, we're stripping away an important TS feature, and thus we should use it sparingly as a last resort
    // Also, the function return type is set to void which means we don't have anything returned (default is undefined)
    // We can set it to undefined, but it shows error because in that case we need to explicitly return undefined, so we use void
    // But in most cases it too is inferred so we don't need to use it all the time
    console.log(thing);
}
printThing(4);
printThing('Egg');
printThing({ animal: 'Gorilla' });
// We also have the boolean type, when used with const the type appears as either 'true' or 'false' because a const doesn't change its value
// But if we use let, we can see boolean type
// We can also override these type definitions, say we have an input field in the html
// Let's select the input elements and the button
var num1El = document.getElementById('num1');
// We can use the as keyword to cast a value to a certain type
var num2El = document.getElementById('num2');
// In order to cast, we can also use the angle brackets with element type inside
var submitBtn = document.getElementById('submit-btn');
var resultArray = [];
// By using [] after the object type definiton, we can indicate that it is an array containing that type of object
// We can also dictate the type of data our array needs to contain this way, and type inference can also do it for us if an element is given
var names = ['Gabriel']; // Will be inferred string type array
// We can also use union for the normal types, so we can use them in a new print function
// But we can also instead use something other than the type when we might not want to deal with literals
// The enum type, like type, is present on TS but not JS, and it is defined inside curly braces without assignment
var OutputType;
(function (OutputType) {
    OutputType[OutputType["CONSOLE"] = 0] = "CONSOLE";
    OutputType[OutputType["ALERT"] = 1] = "ALERT";
})(OutputType || (OutputType = {}));
;
// This way we can define two possible values, which can be accesed wtih dot notation
function printOne(item, method) {
    // if (method === 'console') {
    //   console.log(item);
    // } else if (method === 'alert') {
    //   alert(item);
    // }
    // This helps us with autocompletion as well as gives us error if we try to pass in some other value
    // With the enum type, we can use it like this:
    if (method === OutputType.CONSOLE) {
        console.log(item);
    }
    else if (method === OutputType.ALERT) {
        alert(item);
    }
}
// Now we can add an event listener
submitBtn === null || submitBtn === void 0 ? void 0 : submitBtn.addEventListener('click', function () {
    // Note: one thing the course doesn't cover is that during initialization, these values may also be null if not found
    // So for such cases we need to use ? at the end to indicate that we only use them if they are available as the primary type
    var num1 = +(num1El === null || num1El === void 0 ? void 0 : num1El.value);
    // These are strings because the value in a input tag is always a string, regardless of the type
    // So we also need to convert them into numbers by simply using typecasting with +
    var num2 = +(num2El === null || num2El === void 0 ? void 0 : num2El.value);
    // We can see that the value property shows an error, even though it compiles with errors into a .js file that works
    // But it produces the same bug of concatenation. Since using a getElementById we can get any type of html element,
    // its return type is HTMLElement, but the value property only exists for HTMLInputElement
    // We can't simply use :HTMLInputElement because the return value may be anything, so we ned to instead use type casting
    var result = add(num1, num2);
    // Then we can use it as the type
    var resultContainer = {
        res: result,
        print: function () {
            printThing(this.res);
        }
    };
    // In this way we can define an object whose keys and value types we can define, though they can be inferred as well
    // Now let's also create an array outside where we can store this result object each time
    resultArray.push(resultContainer);
    // printThing(result);
    // resultContainer.print();
    // printThing(resultArray);
    printOne(result, OutputType.CONSOLE);
    printOne(result, OutputType.ALERT);
});
