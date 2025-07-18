// Numbers
// In JavaScript there is no integer type, all numbers are stored  as 64-bit floating point numbers, so there are some limitations
// The largest integet we can operate with using arithmetics here would be 2^53 - 1, we can see it as
console.log(Number.MAX_SAFE_INTEGER);
// or the same thing
console.log(Math.pow(2, 53) - 1);
// Similarly we also have minimum safe integer which is this number but negative
console.log(Number.MIN_SAFE_INTEGER);
// But the largest number we can work with is:
console.log(Number.MAX_VALUE);

// Working with Floating Point Imprecision
// Just like we can't store a value like 1/3 as 0.3333.. in decimal representation properly, we can't represent some fractions in binary well
// Because of that, when we do floating point calculations, we might get unexpected results
console.log(0.2 + 0.4); // Should be 0.6 but is not shown as such
// 0.2 is 1/5 and in binary that can't be stored in the 64 bits we have. so we have only an inaccurate representation
// We can use toString with the base as parameter to convert the number into a stirng with a given base
console.log((0.2).toString(2));
// Similarly, we can use the toFixed method with number of characters as a parameter to display after the dot
console.log(0.2); // Shows 0.2 because of clever rounding by JS, and other languages too, but
console.log((0.2).toFixed(20));
// One way to ensure 0.2 + 0.4 is 0.6 is to only take a few numbers from the output
console.log((0.2 + 0.4).toFixed(2)); // This will yield 0.60
// But we may want to have a higher precision, i.e. avoid the perils of floating point
// In that case we can just perform the operation in integer format which doesn't have this disadvantage of floating point
console.log((0.2 * 100 + 0.4 * 100) / 100);
// https://stackoverflow.com/questions/11695618/dealing-with-float-precision-in-javascript
// JS Number Encoding: https://2ality.com/2012/04/number-encoding.html
// Floating Point Automatic: https://en.wikipedia.org/wiki/Floating-point_arithmetic

// BigInt
// When we want to store something larger than MAX_SAFE_INTEGER, we cna use BigInt which is internally managed as a string
// To make a number bigint, we can simply add n to the number at the end. We can also use parseInt to convert from bigint to integer
// And we can use BigInt to convert from integer to bigint. We can't use floating point operations with BigInt, only integer
console.log(Number.MAX_SAFE_INTEGER + 200); // Displays incorrectly
console.log(3543289547934857435n + 2n);
console.log(BigInt(Number.MAX_SAFE_INTEGER) + 200n); // Displays correctly

// Global Number object
// The number object has many properties which we can use
console.log(Number.POSITIVE_INFINITY); // Gives out infinity, which is basically the result of a divide by zero operation
console.log(Number.NEGATIVE_INFINITY);
// We can also check if a number is finite
console.log(Number.isFinite(15));
console.log(Number.isFinite(Infinity));

// Global Math object
// It has many useful methods, like ones to find the values for sinx, cosx, etc and others
// Also we can find absolute value using Math.abs
console.log(Math.abs(-15));

// Generating random numbers
// The Math.random() method can be used to generate a random number between 0 and 1, but what if we want to define a range
// Let's create a function for it
function randomInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
    // In order to get a number greater than minimum, we need to add min to establish a baseline, and multiply by difference
    // But since it doesn't give us 0 to 1 with 1 included, we need to add 1 more and use Math.floor to bring the number down to last integer
}
console.log(randomInRange(4, 9));

// Strings
// We have mnay methods with strings like toUpperCase, trim, etc, we can also use startsWith to check if a string starts with something
console.log('Something'.startsWith('som'));
console.log('Something'.startsWith('Som'));
// We can see the different methods available in the MDN docs. The interesting part if template strings
// We can use any expression inside the curly brackets when we're using template strings, as long as it returns some value
console.log(`I want to eat a ${() => 'burger'}`);
// But we have something else called Template Tags, a different way to call a function

function introduce(string, name, age) {
    console.log(string);
    console.log(name);
    console.log(age);
    // The first argument here is the template string we use to call the function, apart from the template parts, split by those templates
    // The rest of the arguments are the templates sent via the template string
    let verdict = 'I am old,';
    if (age < 30) {
        verdict = 'I am young, only';
    }
    return `${string[0]}${name}. ${verdict} ${age}${string[2]}`;
}

const personName = 'Wilson';
const personAge = 29;
const introduction = introduce`Hi I am ${personName} ${personAge} years old.`;
console.log(introduction);
// In this way of calling the function, we don't need to use the parentheses, we can simply use template strings, i.e. template tags
// The normal text apart from templates are sent as an array, split where the templates occur. The templates themselves are also passed
// It can be used to operate on some base string and modify it, without involving complex logic.
// We don't have to return a string though, we can return an object, return nothing, just operate on the strings as well as templates, etc

// Regular Expressions (RegEx)
// When we need to check for patterns in a string, we can use the includes() method to see whether a string includes a character or substring
// But what if we want to validate an email, we need to check for whether @ and . exist but also we need to check if @ is before .
console.log('test.test@com'.includes('@') && 'test.test@com'.includes('.'));
// This would be true, which is not what we want. So we can use a regex, which is present in almost all programming languages
// To create a Regular Expression, we can use the RegExp constructor function, or we can use //
const regex1 = new RegExp('^S$');
// We have another more straightforward way
const emailRegex = /^\S+@\S+\.\S+$/; // This can check whether the start has a string and then a @, then a string, then a dot then a string at end
// Then we can use the .test method to check a string using the regex
console.log(emailRegex.test('test.test@com')); // false
console.log(emailRegex.test('test@test.com')); // true

// Regex examples
// We can use normal regex like checking if a word contains hello somewhere using /hello/
// Regex is case sensitive so if we want to allow different cases for some character, we can use
const helloCheck = /(h|H)ello/;
// This will match any string that has either lowercase or uppercase h
console.log(helloCheck.test("oh hello it's you")); // true
console.log(helloCheck.test("woww Hello.. it's you")); // true
console.log(helloCheck.test("woww Helllo.. it's you")); // false

// We can also use wildcard characters, that allow any string except for empty, so if I use
const elloCheck = /.ello/;
// It will match anything that has ello as long as it has something before it too, can also be whitespace
console.log(elloCheck.test("woww hello.. it's you")); // true
console.log(elloCheck.test('ello.. hehe')); // false
// In the expression we used for email, we used /. which is used to escape . since we're not using a wildcard but instead looking for .
// learning Regex takes a long time and mostly we'll want to look up the regex on google because others would have figured it out already
// Rather than spending time constructing our regex for normal stuff like urls, emails, we can look them up
// We can learn more about Regex from the youtube playlist: https://www.youtube.com/watch?v=0LKdKixl5Ug&list=PL55RiY5tL51ryV3MhCbH8bLl7O_RZGUUE

// This is it for this lesson it seems. Pretty short one. But next is asynchronous JS, longer
