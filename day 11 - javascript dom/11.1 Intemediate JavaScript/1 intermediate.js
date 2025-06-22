// Random number
/* In JavaScript, we have many other useful functions, such as Math.random() which lets us generate a random number
The number is between 0 and 0.999... upto 16 decimal places, but never 1
It is pseudorandom, because computer is deterministic and we're only feigning randomness
If we want to create a dice rolling action, we can use the following */
var diceResult = Math.floor(Math.random() * 6) + 1;
console.log(diceResult);

/* This has a lot of parts. First Math.random generates a number between 0 and 1 not inclusive of 1. Since we need 1-6 we need to scale it
We multiply it by 6, then we use Math.floor because we want a whole number. Now it has the range 0-5 so we add 1 to make it 1-6 */

/* Now a challenge at this point is to create a love calculator which takes the names of two people and returns a random percentage */
prompt('Enter your name');
prompt("Enter your partner's name");
var lovePercent = Math.floor(Math.random() * 100);
// In her solution, she did +1 as well for the percent, but nothing is perfect so I'll keep the range 0-99

// Control flow: Conditionals
/* In order to make decisions based on conditions, we need to use conditional statements that perform a certain code in one condition
And a different code on the other. We can use the if-else statements to do so. In the above code, we can include an if statement
which displays a different message when the love percent is very high*/
if (lovePercent > 70) {
    alert('The love score is: ' + lovePercent + '%. Your love is exemplary.');
} else {
    alert('The love score is: ' + lovePercent + '%');
}
/* In these statements, we have an if statement and a condition inside parentheses which says lovePercent greater than 70
And it encloses a block of code using curly braces. That block is run if the condition is true.
If the condition is false, the control flows instead to the else block. */
/* We have different comparators, === for 'is equal to', !== for 'is not equal to', < for 'less than', > for 'greater than'
We also have >= and <= for greater than or equal to, and less than or equal to
But we can also use two equal signs == instead of three for equality. Here's the difference */
if (1 === '1') {
    console.log('Yes');
} else {
    console.log('No');
} // This should give no

if (1 == '1') {
    console.log('Yes');
} else {
    console.log('No');
} // This should give yes
/* As we can see, the triple equal sign checks for both the value and the data type, but double equals only checks for the value */

/* We can combine these comparators by using comparatives like && (AND) and || (OR)
In the love calculator, we can instead check for different conditions like: */
if (lovePercent > 70) {
    alert('The love score is: ' + lovePercent + '%. Your love is exemplary.');
}

if (lovePercent > 30 && lovePercent <= 70) {
    alert('The love score is: ' + lovePercent + '%');
}

if (lovePercent <= 30) {
    alert(
        'The love score is: ' + lovePercent + '%. Your love needs an upgrade.'
    );
}

/* Now we need to test if a year is leap year, but based on only if-else, it actually might be difficult. Here's how I would handle it */
function isLeap(year) {
    if (year % 4 === 0) {
        console.log('Divisible by 4. It is a leap year.');
        finalVerdict = 'Yes it is a leap year.';
    }
    if (year % 100 === 0) {
        console.log('Divisible by hundred. It is NOT a leap year.');
        finalVerdict = 'No it is not a leap year.';
    }
    if (year % 400 === 0) {
        console.log('Divisible by 400. It is a leap year.');
        finalVerdict = 'Yes it is a leap year.';
    }
    if (year % 4 !== 0) {
        console.log('Not divisible by four. It is NOT a leap year.');
        finalVerdict = 'No it is not a leap year.';
    }
    return finalVerdict;
}
/* I wonder if she finally introduces nested ifs here. */
console.log('Final verdict: ' + isLeap(2000));

// Okay she finally introduced the concept of nested ifs, though she didn't say it explicitly. here's the refactored isLeap
function isLeap(year) {
    if (year % 4 === 0) {
        if (year % 100 === 0) {
            if (year % 400 === 0) {
                return 'Leap year.';
            } else {
                return 'Not leap year.';
            }
        } else {
            return 'Leap year.';
        }
    } else {
        return 'Not leap year.';
    }
}

// Arrays
/* If we want to store multiple values of the same type, we don't want to use different variables for all of them
We can instead create a single variable and include them all inside that variable eclosed by square brackets */
var guests = ['Jacob', 'Harry', 'Britney', 'Sasha', 'Mandy'];
/* In this array, we have 5 people. We can access a specific person from the list by using their number i.e.*/
console.log(guests[1]); // Since counting starts from 0, this will return the second person i.e. Harry
/* We alos have other features in an array. We can use the .length property to get the length of array, like strings
We can also use .includes(item) to search for the item inside the array, and it returns a boolean */
console.log(guests); // Returns the entire array
console.log(guests.length); // Returns only the length of the array

/* Our challenge is to write code that welcomes a guest if they're in the list, else it tells them they're not invited
Since boolean conditionals have not yet been covered, I'm curious as to how she covered it. But here's a solution in the meanwhile */
var yourName = prompt('Hi, what is your name?');
if (guests.includes(yourName) === true) {
    // Of course I could ditch === true but would a newbie know that?
    console.log('Welcome to the party');
} else {
    console.log("Sorry, you're not invited");
}
// She ditched the === true without saying anything, but she did say "if it is true", so that counts maybe

// FizzBuzz
/* The FizzBuzz challenge goes like this: we need to display the numbers from 1 to 100
Each number divisible by 3 is replaced with "Fizz" and each number divisible by 5 is replaced with "Buzz"
If the number is divisible by both it is replaced by "FizzBuzz" */
/* First we need to have 100 numbers, we can store them in an array. We can start from an empty array */
var numbers = [];
/* We can use the function .push() to insert an item to the end of an array, and we can use .pop() to get the last item out
Our challenge is to create a function that when it is run each time, it will add another number to the numbers array
For example, first call adds 1, then 2 then 3 and so on. This might be hard for a newbie, but here's what I might do: */
function fizzBuzz() {
    numbers.push(numbers.length + 1);
    console.log(numbers);
}

/* I might have gotten too clever with my soolution. The course solution included a variable that keeps track of the number to be pushed
Let's use that as the approach for the next challenge, which is pushing Fizz instead of number divisible by 3,
Buzz instead of number divisible by 5 and FizBuzz instead of number divisible by both */
var output = [];
var count = 1;
function fizzBuzzNew() {
    if (count % 3 === 0) {
        if (count % 5 === 0) {
            output.push('FizzBuzz');
        } else {
            output.push('Fizz');
        }
    } else {
        if (count % 5 === 0) {
            output.push('Buzz');
        } else {
            output.push(count);
        }
    }
    count++; // Somehow forgot this in my first try
    console.log(output);
}
// In the course, she finally introduced the else if block, but didn't say anything else, used it straight

// So now I'll have to create a new updated function for this:
function fizzBuzzCourse() {
    if (count % 3 === 0 && count % 5 === 0) {
        output.push('FizzBuzz');
    } else if (count % 3 === 0) {
        output.push('Fizz');
    } else if (count % 5 === 0) {
        output.puth('Buzz');
    } else {
        output.push(count);
    }
    count++;

    console.log(output);
}
/* In this function, we can see the flow of control. When the first if statement becomes true, it ignores all the other blocks
So the else if and else blocks will not be checked when the first one is true, so we had to put fizzbuzz condition at first
It ensures the condition where the number is divisible by both is checked and doesn't get skipped when either is true */

/* Challenge: Who's paying for lunch
There's a list of people among which a random person will have to pay for lunch. We have to return a name from an array of names */
var names = ['Serena', 'Steve', 'Marcelo', 'Gill', 'Wayne'];
function whoIsPaying(names) {
    return names[Math.floor(Math.random() * names.length)];
}
console.log("Today's payer is " + whoIsPaying(names));
/* Basically, I want something from 0-5 so I take a random number from 0-1, scale to 0-5, not including 5, then take floor i.e. 0-4 whole number
the names can be any list, any length so I used names.length to give me a number to use */

// Okay almost 200 lines, maybe I should split this course here into another file.
