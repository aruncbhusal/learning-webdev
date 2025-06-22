// Functions

/* Writing a series of lines of code over and over when we want to do something again is tedious and tiring
We can instead package the code into a block, called a function, and give it a name, so that we can execute it just from its name
A function can be defined as follows: */
function doSomething() {
    console.log('First, do this.');
    console.log('Then, do this.');
    console.log('Now, do this.');
    console.log('Do this afterward.');
    console.log('Finally, do this.');
}
/* Things we can see here:
1. A function can be created (defined) using the function keyword, similar to creating a variable
2. We can give it a name, and similar naming rules and convention applies to variables and functions
3. Then we use parentheses, leave them empty for this occasion. We can have non empty ones, like the alert() function too
4. Then the block of code to execute is packaged inside curly braces
Here the block consists of console.log() which is used to show output on the console to developers, instead of normal users
5. We need not give a semi-colon after the end of the function definition */

// In order to execute the function/use it (call the function), we can simply use the name of the function with parentheses
doSomething();

// Karel the Robot
/* In Stanford's Karel site: https://stanford.edu/~cpiech/karel/ide.html we have a playground with a robot and a grid
The robot starts from the bottom-most grid, and we have some functions: move(), turnLeft(), putBeeper() and pickBeeper()
We also have conditions but for the sake of this challenge, we don't use them.
We are given an empty function called main() where we can put our code. To go in circle we can move and turn left repeatedly 4 times
We can create a new function to do so as well, so that we can go in circle without having to write all that code again */
/* Our task is to move from bottom-left (start) to top-right in a 5x5 grid. This was my solution: */
function main() {
    move4();
    turnLeft();
    move4();
}

function move4() {
    move();
    move();
    move();
    move();
}
// Basically what she did as well

/* Now the next challenge needs us to place the beeper in a diagonal order from bottom-left to top-right. This was my solution */
function main() {
    putBeeper();
    moveDiagonally();
    moveDiagonally();
    moveDiagonally();
    moveDiagonally();
}

function moveDiagonally() {
    move();
    turnLeft();
    move();
    turnLeft();
    turnLeft();
    turnLeft();
    putBeeper();
}

// But wait a second, she used the turnRight() command, which is available as a "new command" in the site. If I use that:
function moveDiagonally() {
    move();
    turnLeft();
    move();
    turnRight();
    putBeeper();
}
// Now this solution is the same as the course solution, just that beeper is placed before turning in hers, but that makes no difference

/* Okay there is an optional challenge, but we're not skimping on that, so we'll create a chessboard like pattern with beepers here
Here's my challenge, though I have used way too many functions to make my main function as short as possible
I'm looking forward to how is is tackled in the course */
function main() {
    putBeeper();
    oddRows();
    evenRows();
    oddRows();
    evenRows();
    moveAndBeeper();
    moveAndBeeper();
}

function moveAndBeeper() {
    move();
    move();
    putBeeper();
}
function diagAndBeeper() {
    turnRight();
    move();
    turnLeft();
    move();
    putBeeper();
}
function evenRows() {
    moveAndBeeper();
    diagAndBeeper();
    turnAround();
}
function oddRows() {
    moveAndBeeper();
    moveAndBeeper();
    turnAround();
    diagAndBeeper();
}

/* Okay the course solution doesn't look too much different, since it has beepersRight function where it places 3 beepers i.e. odd rows
and a beepersLeft which places 2 beepers i.e. even rows. Then there's two functions that move right facing robot up and turn left,
and move left facing robot up and turn right. This way robot finishes one row, goes to adjacent cell of another, and continue until done. */

// Function Flavor 2
/* Instead of a function just repeating a block of code, what if it could do more? What if we could give it an input and it could work with it
We can do so by giving it a variable inside the parentheses when declaring the function, then we can give it a value when calling 
For example: */
function moveForth(steps) {
    console.log('I moved ' + steps + ' steps.');
}
/* In this function, we give it a variable steps, which we use later in the console.log to say how many steps it moved
We can call this function the following way: */
moveForth(15); // it will move 15 steps

/* The challenge for this part is to have a getMilk function(was given but it's too basic) which takes amount of money as input
The output should be "I bought ... bottles of milk". The number of bottles should be calculated according to price of milk($1.5) 
I'm not sure how she expects newbies to handle a flooring division, but I'll do what I know, using only things taught so far. */
function getMilk(money) {
    var bottles = (money - (money % 1.5)) / 1.5;
    // I'm sure there's an easier way, but I just can't stretch my mind enough
    // var bottles = Math.floor( money / 1.5 );
    console.log('I got ' + bottles + ' bottles of milk!');
}
getMilk(20);
/* Okay as suspected initially, the expectation was that people would google it and find out about the Math.floor() function */

/* There appears to be another challenge called "Life in Weeks" where age is given as input, and we have to find
the number of days, number of weeks and number of months left to live, if living upto 90. A year = 365 days = 52 weeks = 12 months
I'll do this quickly as well */
function lifeInWeeks(age) {
    var yearsLeft = 90 - age;
    console.log(
        'You have ' +
            yearsLeft * 365 +
            ' days, ' +
            yearsLeft * 52 +
            ' weeks, and ' +
            yearsLeft * 12 +
            ' months left to live.'
    );
}
lifeInWeeks(25); // How scary!

// Function Flavor 3
/* A function can not only take inputs, but it can also give out outputs. This can be done using the return keyword.
This returned output can then be stored into a variable and used, after calling the function. For example: */
function drinkWater(capacity) {
    var remainingWater = capacity - 2;
    return remainingWater;
}
var waterLeft = drinkWater(5);
console.log("Now there's " + waterLeft + 'L water left.');

/* This means we can also call one function inside another function and use the value from there.
We can take multiple inputs to a function as well. So if we modify the getMilk function above, we can do this: */
function getMilk(money, milkPrice) {
    console.log(
        'I bought ' + calculateBottles(money, milkPrice) + ' bottles of milk.'
    );
    var change = calculateChange(money, milkPrice);
    return change;
}
function calculateBottles(money, milkPrice) {
    return Math.floor(money / milkPrice);
}
function calculateChange(money, milkPrice) {
    return money % milkPrice;
}

var change = getMilk(5, 1.5);
console.log('I also brought ' + change + ' in change.');

/* Now there's a BMI calculator challenge, where we need to create a function that takes weight and height as input and calculates BMI
The challenges are in Udemy's quiz format so I'll need to copy the code here once done. */
function bmiCalculator(weight, height) {
    // The formula is weight/height^2 so I'll need to use multiplication to mimic the work of square here
    return weight / (height * height);
    // She brought up Math.pow() for squaring and Math.round() for whole number so this is what we'd do for that:
    // return Math.round(weight / Math.pow(height, 2));
}
var bmi = bmiCalculator(65, 1.8);
console.log('The BMI was found to be: ' + bmi);

// This one is close to 200 lines as well, and I think we're done with today's part. More tomorrow.
