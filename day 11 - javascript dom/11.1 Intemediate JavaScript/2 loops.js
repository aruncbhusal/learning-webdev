// Loops: While loop
/* In the fizzbuzz challenge above, we are adding numbers to the output array one at a time ourselves.
But we can let the computer do it automatically, by using loops. The simplest type of loop is while loop
It has a condition and the loop runs as long as the condition is true. When the full code block finishes executing, it checks condition again.
We can write the fizzbuzz solution like this instead */
var outputLoop = [];
var counter = 1;

function fizzLoop() {
    while (counter <= 100) {
        if (counter % 3 === 0 && counter % 5 === 0) {
            output.push('FizzBuzz');
        } else if (counter % 3 === 0) {
            output.push('Fizz');
        } else if (counter % 5 === 0) {
            output.puth('Buzz');
        } else {
            output.push(counter);
        }
        counter++;
    }
    console.log(outputLoop);
}
fizzBuzz();
/* In this code, the block inside the while statement will run as long as counter is less than or equal to 100
counter starts from 1 so it is true, then at the end it becomes 2, and so on until it becomes 101, when the while condition is false
At that point, it skips the block and goes to the next line which is console.log(outputLoop)
Though this is convenient, it has a danger. What if we forgot to increment the counter, the condition would never become false
Then the loop will run forever (infinite loop) and the browser/tab would crash. */

/* Now we have another challenge, to write out the lyrics of 99 bottles of beer on the wall, using while loop */
function beersOnTheWall() {
    var beers = 99;
    var lyrics = '';
    var howMany = beers + ' bottles';
    while (beers >= 0) {
        lyrics = howMany + ' of beer on the wall, ' + howMany + ' of beer.';
        beers--;
        if (beers === 1) {
            howMany = beers + ' bottle';
        } else if (beers === 0) {
            howMany = 'No more bottles';
        } else {
            howMany = beers + ' bottles';
        }
        if (beers < 0) {
            lyrics =
                lyrics +
                'Go to the store and buy some more, 99 bottles of beer on the wall.';
        } else {
            lyrics =
                lyrics +
                ' Take one down and pass it around, ' +
                howMany +
                ' bottles of beer on the wall.';
        }
        console.log(lyrics);
    }
}
beersOnTheWall();
/* This might be a bit too much for a newbie I admit, but since there were multiple conditions I just couldn't stop myself
One other method would be to pay no heed to when there's 1 bottle left and let it write bottles.
Then I could bring the condition for 0 beers out of the loop and handle it separately. */

/* And this is the course solution, it has no condition given for no bottles on the wall and left as an exercise
var numberOfBottles = 99 */

function beers() {
    while (numberOfBottles >= 0) {
        var bottleWord = 'bottle';
        if (numberOfBottles === 1) {
            bottleWord = 'bottles';
        }
        console.log(
            numberOfBottles + ' ' + bottleWord + ' of beer on the wall'
        );
        console.log(numberOfBottles + ' ' + bottleWord + ' of beer,');
        console.log('Take one down, pass it around,');
        numberOfBottles--;
        console.log(
            numberOfBottles + ' ' + bottleWord + ' of beer on the wall.'
        );
    }
}
/* Immediate mistake here would be that the condition for bottle and bottles is reversed, we should have bottle for 1 and bottles otherwise
Also it doesn't care about the bottleWord change in the last line, just the number of bottles. So my solution looks sound. */

// For loop
/* Apart from while loop, there is also for loop where in the parantheses, we have three things (start, end, change)
The start is where a variable is declared/start value is set. The end is a condition which must be true for loop to run
The change is a change on the variable made at the end of the loop's block. So the fizzbuzz programm above could look like: */
function fizzFor() {
    for (var counter = 1; counter <= 100; counter++) {
        if (counter % 3 === 0 && counter % 5 === 0) {
            output.push('FizzBuzz');
        } else if (counter % 3 === 0) {
            output.push('Fizz');
        } else if (counter % 5 === 0) {
            output.puth('Buzz');
        } else {
            output.push(counter);
        }
    }
    console.log(outputLoop);
}
fizzFor();
/* We can see here that we consolidated the var counter = 1; statement, the while condition, and increment in a single for line
This makes it easier to do certain stuff and is called a syntactic sugar in programming as it sweetens the syntax
The difference between for and while is that for is used for iterating a fixed number of times, and while to execute when a state is true */

/* The next challenge "boss level" is to return a fibonacci sequence in an array
I think I'll do it with both while and for, just to see how it goes. */
function fibonacciWhile(num) {
    // I wanted to make this simple but I just didn't know how, maybe my brain has already been wired a certain way
    var previous = 0;
    var current = 1;
    var next = 0;
    var output = [];
    var i = 0;
    while (i < num) {
        output.push(previous);
        next = previous + current;
        previous = current;
        current = next;

        i++;
    }
    return output;
}
console.log(fibonacciWhile(10));

/* Now to do it with for loop, I think I will need a different, simpler strategy */
function fibonacciFor(num) {
    // Turns out trying to dumb down your code is harder than it seems, and I'm tyring to think what I can dumb down
    // Whatever, I'll assume the while one was simpler, I'll go shorter for this one
    var output = [];
    for (var i = 0; i < num; i++) {
        if (i <= 1) {
            output.push(i);
        } else {
            output.push(output[i - 1] + output[i - 2]);
        }
    }
    return output;
}
console.log(fibonacciFor(10));

/* The course solution does it a bit differently, putting the first one if n=1, both if n=2, and if it's more, start with 2 numbers
Then a loop from 2 to n-1 where the last and second last items in the array are taken, like my for solution
Honsetly I didn't expect her to use this, but since she did, I don't think I should restrain myself too much now.*/
function fibonacciGenerator(n) {
    var output = [];
    if (n === 1) {
        output = [0];
    } else if (n === 2) {
        output = [0, 1];
    } else {
        output = [0, 1];
        for (var i = 2; i < n; i++) {
            output.push(output[output.length - 2] + output[output.length - 1]);
        }
    }
    return output;
}
console.log(fibonacciGenerator(10));
