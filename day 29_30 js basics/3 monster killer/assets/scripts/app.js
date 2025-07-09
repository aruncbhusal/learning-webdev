// Here's yet another file, with pre-given html, css and a vendor.js file
// This is a game where we fight with a monster. There are functions and html items defined in vendor file which we can use here

// First let's define the damage dealt by each attack as a global constant
const ATTACK_DAMAGE = 10;
// when creating global constants, we can choose to use this uppercase format to separate from other variables/local constants
const MONSTER_ATTACK_DAMAGE = 14;
const STRONG_ATTACK_DAMAGE = 19;
const MAX_HEAL = 24;

const ATTACK_NORMAL = 'NORMAL';
const ATTACK_STRONG = 'STRONG';
// Instead of using strings here, we could also have used numbers, since we're just comparing
// Now we can also create identifier constants for different events we might want to log
const LOG_EVENT_PLAYER_ATTACK = 'PLAYER_ATTACK';
const LOG_EVENT_PLAYER_STRONG_ATTACK = 'PLAYER_STRONG_ATTACK';
const LOG_EVENT_PLAYER_HEAL = 'PLAYER_HEAL';
const LOG_EVENT_MONSTER_ATTACK = 'MONSTER_ATTACK';
const LOG_EVENT_GAME_OVER = 'GAME_OVER';

// Let's create a placeholder max health value (later we will take input from user)
// let maxHealth = 100;
// Now that the reset functionality is there as well, we need to allow user to input desired max health
// Browser provides a useful function called prompt which lets us ask the user for an input, and it returns a value which we can use
//                      let maxHealth = prompt('Enter the max health value', '100');
// This gives the user an input option with 100 set as default value, but it is a string and we need to convert it to number
//                      maxHealth = parseInt(maxHealth);
// parseInt function and JS in general is forgiving, so it lets us enter something that isn't a number, and it just converts to NaN
// But we may want to throw an error ourselves, because that indicates that it is not something we expected
// Let's create a new function and use it to get a value from the user, then use it to throw and catch errors

// But what if the user didn't even input a number, then parseInt would return NaN, we have a function called isNaN to check for it
// if (isNaN(maxHealth) || maxHealth <= 0) {
//     // We also check for whether maxHealth is 0 or less, but it is only possible when maxHealth is a number
//     // Since we're using || operator, the second condition is only checked when first is false
//     // If maxHealth is not a number, then the condition automatically becomes true and second condition is not checked
//     // In case of &&, the second condition is only checked when first is true, else the condition becomes false automatically
//     maxHealth = 100;
// }

function getUserInput() {
    let inputValue = prompt('Enter the max health value', '100');
    parsedValue = parseInt(inputValue);
    if (isNaN(parsedValue) || parsedValue <= 0) {
        // Instead of setting a default value here, we can throw an error:
        throw { message: 'Invalid input. Not a number!' };
    }
}

// Let's get the user input from the function
let maxHealth;
// We can use the try-catch block to catch the error we threw here
try {
    maxHealth = getUserInput();
    // We only put this line in the try block because it might have an error not in our control
    // We should always debug the code that is possible to be debug
} catch (error) {
    // This error parameter catches any error that might have been thrown, in our case it was the error object
    console.log(error);
    maxHealth = 100;
} finally {
    // This is an optional block that we can use for cleaning up the try block, logging info, etc and it is executed regardless of error
    // In fact we can have either catch or finally blocks, or both. This time I'll leave this as empty
}

// Now we need to assign this max health to both the monster and the player
let currentPlayerHealth = maxHealth;
let currentMonsterHealth = maxHealth;
let hasBonusLife = true;

// We will store the logs in an array
let eventLogs = [];

// We want to deal damage to the monster when we press attack, for which the button is selected in the vendor.js
// We can add event listener like last module to listen for clicks
attackBtn.addEventListener('click', handleAttack);
// We have set to call handleAttack here when attackBtn is clicked, so let's create that function

function handleAttack() {
    /*
    // The naming for the function is personal preference but we should stick to consistent naming
    // When making an attack we should deal damage to the monster. For it we have another function so let's use that
    const monsterDamage = dealMonsterDamage(ATTACK_DAMAGE);
    // After the damage is dealt, we also need to reduce the health of the monster, we use the damage value returned by this function
    currentMonsterHealth -= monsterDamage;

    // But the monster should get to attack too, so let's create another constant and use the dealPlayerDamage function as well
    const playerDamage = dealPlayerDamage(MONSTER_ATTACK_DAMAGE);
    // Note: even though monster attack damage is higher, the functions for damage deal random damage between 0-14 so any can win
    currentPlayerHealth -= playerDamage;

    // Now we need a final condition, when either one loses all health, then we should declare a winner
    // If monster health is 0 or less, player has won, and vice versa
    // But there is a problem, what if both have 0 or less? Then we need to call it a draw, but if we use 'else'
    // It will get run each time the other conditions are not true, which means every time click is pressed but nobody has won yet
    // So we should use only else if here. But we should draw when both are zero, and when this condition is true, the above two are true as well
    // This means this condition will never get to run. So we need to modify the above conditions to only be true when only one is <=0
    if (currentPlayerHealth > 0 && currentMonsterHealth <= 0) {
        alert('You won!');
    } else if (currentMonsterHealth > 0 && currentPlayerHealth <= 0) {
        alert('You lost.');
    } else if (currentMonsterHealth <= 0 && currentPlayerHealth <= 0) {
        alert("It's a draw.");
    }
    */
    // Since we have a function to do this we can call it from here
    //                          attackMonster('NORMAL');
    // When we pass string parameters to check like this, it is possible that we may make typos
    // In order to avoid this, we can create constant identifiers with the string values, so we don't have to worry about mistyping
    attackMonster(ATTACK_NORMAL);
}

// We also have a button to deal strong attack to the monster so let's use that to create another event listener
strongAttackBtn.addEventListener('click', handleStrongAttack);

// Now we need a handleStrongAttack function
function handleStrongAttack() {
    // Both this function and handleAttack function do the same thing, but it should use a higher value than ATTACK_DAMAGE
    // Since copying that code and using here is not good, we can create a new function for both attacks
    // We need to know which attack we need to do so we pass in a parameter for attack mode
    // It then uses theh mode to find out whether we want to make a normal or strong attack, and it deals that amount of damage
    // We can copy the code from handleAttack there, and simply call that function from both the handle functions
    // attackMonster('STRONG');
    attackMonster(ATTACK_STRONG);
}

function attackMonster(mode) {
    // To find out what kind of attack to do, we can use an if statement
    /*
    let maxDamage;
    let logEvent;
    if (mode === ATTACK_STRONG) {
        maxDamage = STRONG_ATTACK_DAMAGE;
        logEvent = LOG_EVENT_PLAYER_STRONG_ATTACK;
    } else if (mode === ATTACK_NORMAL) {
        maxDamage = ATTACK_DAMAGE;
        logEvent = LOG_EVENT_PLAYER_ATTACK;
    }
    */
    // In this if block, all we're doing is assigning some values on certain condition
    // Since if statement doesn't return a value, we need to put it inside the block, but we can instead use ternary operator
    // Which returns a value and can be written as condition ? value_if_true : value_if_false
    // So we can then write maxDamage and logEvent as consts as they don't change value
    const maxDamage =
        mode === ATTACK_STRONG
            ? STRONG_ATTACK_DAMAGE
            : mode === ATTACK_NORMAL
            ? ATTACK_DAMAGE
            : 0;
    // We must always give both true and false conditions, and we can also nest the operators like above
    // But since in this case the only values are either strong, or normal, we can also simply use
    const logEvent =
        mode === ATTACK_STRONG
            ? LOG_EVENT_PLAYER_STRONG_ATTACK
            : LOG_EVENT_PLAYER_ATTACK;
    // This is a statement. The right hand side part of this statement is an expression. It can also be an expression statement
    // When we need a statement (normal code flow), we can write either a statement, like if statement, or an expression
    // But we can't write a statement where an expression is expected i.e. on the right hand side of an assignment
    // An expression evaluates to a value, a statement may not

    // Now we use the maxDamage variable to deal damage to the monster
    const monsterDamage = dealMonsterDamage(maxDamage);
    currentMonsterHealth -= monsterDamage;

    // We need to add event log when we attack the monster
    // We first need to know what the attack mode was to use the value as a parameter
    writeToLog(
        logEvent,
        monsterDamage,
        currentPlayerHealth,
        currentMonsterHealth
    );

    /*
    const playerDamage = dealPlayerDamage(MONSTER_ATTACK_DAMAGE);
    currentPlayerHealth -= playerDamage;

    if (currentPlayerHealth > 0 && currentMonsterHealth <= 0) {
        alert('You won!');
    } else if (currentMonsterHealth > 0 && currentPlayerHealth <= 0) {
        alert('You lost.');
    } else if (currentMonsterHealth <= 0 && currentPlayerHealth <= 0) {
        alert("It's a draw.");
    }
    */
    // We replace this code with the function we create below since we will need this part in the heal function as well
    endRound();
}
// Since it is late today, I will pause the development here, since this folder is joint for day 28 and 29 I can continue from here
// We dealt with dealing normal or strong attacks, win condition, dealing damage, and taking repeated code into a new function.

// Now we need to add a new "heal" functionality
// In each round the player can choose to either attack or heal. So this means we need to heal then repeat the things in attack function
// But since we don't want to do that, let's first create a new function that handles the rest of the round for us
function endRound() {
    const initialPlayerHealth = currentPlayerHealth;
    const playerDamage = dealPlayerDamage(MONSTER_ATTACK_DAMAGE);
    currentPlayerHealth -= playerDamage;

    // Since we also have a bonus life available, we can implement it here
    // It resets the health to before the monster attacked, in the case that the monster attack reduced player health<0
    // So let's have a boolean variable to track whether we have a bonus life available
    // Then we can copy the initial player health before monster attack so that we can reset in case player health <0
    if (currentPlayerHealth <= 0 && hasBonusLife) {
        // We're using the boolean directly as a condition here, in this case we should consume the bonus life
        hasBonusLife = false;
        removeBonusLife();
        // Finally we reset the current player health back to initial
        currentPlayerHealth = initialPlayerHealth;
    }

    // We need to write a log here as well, after monster does damage
    writeToLog(
        LOG_EVENT_MONSTER_ATTACK,
        playerDamage,
        currentPlayerHealth,
        currentMonsterHealth
    );

    // Finally we also need to log at game over, the course calls the function each time, but we can simply call it with reset
    let logValue;
    if (currentPlayerHealth > 0 && currentMonsterHealth <= 0) {
        alert('You won!');
        logValue = 'Player won';
    } else if (currentMonsterHealth > 0 && currentPlayerHealth <= 0) {
        alert('You lost.');
        logValue = 'Player lost';
    } else if (currentMonsterHealth <= 0 && currentPlayerHealth <= 0) {
        alert("It's a draw.");
        logValue = 'Draw';
    }

    // In order to add the reset function here, we can add the function call inside each of the blocks above
    // We can also create a separate if block here which checks for the if condition || else if condition 1 || else if condition 2
    // But that has repitition, we can simply check if either of the healths are <= 0 and reset on that condition
    if (currentPlayerHealth <= 0 || currentMonsterHealth <= 0) {
        // We can now call the log function here to record the game over event
        writeToLog(
            LOG_EVENT_GAME_OVER,
            logValue,
            currentPlayerHealth,
            currentMonsterHealth
        );

        reset();
    }
}

// Now we can add the heal function by using the heal button in vendor.js and heal function
healBtn.addEventListener('click', healHandler);

// The function to handle the healing
function healHandler() {
    // We cannot heal the player above max HP so let's keep track of how much the player can heal
    let healValue;
    // Now we can use a conditional to check if healValue is greater than difference between max and current health
    if (healValue >= maxHealth - currentPlayerHealth) {
        // We can't allow healing beyond max health so we set healValue to equal this
        healValue = maxHealth - currentPlayerHealth;
        alert("You can't heal beyond max health.");
    } else {
        // If full heal is allowed, we can set healValue to equal the MAX_HEAL constant declared above
        healValue = MAX_HEAL;
    }
    // Let's now call the heal function
    increasePlayerHealth(healValue);
    // This function is only for the bar, for the actual health we will need to update the health we track as well
    currentPlayerHealth += healValue;

    // Let's log here
    writeToLog(
        LOG_EVENT_PLAYER_HEAL,
        healValue,
        currentPlayerHealth,
        currentMonsterHealth
    );

    // Since the heal is now complete, we can continue with the round and let monster attack
    endRound();
}

// Now let's also implement the reset game functionality
function reset() {
    // This only resets both player and monster healths to max, but doesn't reset bonus life, as that wasn't added in vendor.js
    // We need to change the current healths here, and call the reset function in vendor.js
    currentPlayerHealth = maxHealth;
    currentMonsterHealth = maxHealth;
    resetGame(maxHealth);
    // Now we can use this inside the endRound where the game over condition is checked
}

// Time to add the logging funcionality. We need an array to store all the logs, which we will store as objects
// Let's create a new function to create new logs, and then one to display all logs
function writeToLog(event, value, playerHealth, monsterHealth) {
    // In order to create a log, we can use an object to store the current entry
    let logEntry = {
        event: event,
        value: value,
        playerHealth: playerHealth,
        monsterHealth: monsterHealth,
    };
    // We can see that the key and values are named the same, which is permitted. We can also change parameter name for clarity

    // We can add new properties to objects by simply using the dot notation
    /*
    if (
        event === LOG_EVENT_PLAYER_ATTACK ||
        event === LOG_EVENT_PLAYER_STRONG_ATTACK
    ) {
        // Here we can add a new property called 'target'
        logEntry.target = 'MONSTER';
    } else if (
        event === LOG_EVENT_MONSTER_ATTACK ||
        event === LOG_EVENT_PLAYER_HEAL
    ) {
        logEntry.target = 'PLAYER';
        // In the course there were many conditions, but we can simply change it to this
    }
    // We don't have a condition for game over because there is no target, and we can leave it empty
    */

    // We can instead use switch statement here, since here we simply do equality checks
    // To use it, we use the switch keyword with a value/expression (which evaluates to a value), and then add cases
    switch (event) {
        case LOG_EVENT_PLAYER_ATTACK:
            // After case keyword we add the case to compare the value inside the parentheses, if it matches, this will run
            logEntry.target = 'MONSTER';
            // After the code for a case is complete, we should use a break statement so indicate end of block
            break;
        // If we don't have this statement, the case below this one will also be executed
        case LOG_EVENT_PLAYER_STRONG_ATTACK:
            logEntry.target = 'MONSTER';
            break;
        case LOG_EVENT_MONSTER_ATTACK:
        // Since this is redundant, I can simply leave this case empty and because there is no break here,
        // it will execute the one below, where I have the common code to be executed
        // This wasn't covered in the course, but I like doing it
        case LOG_EVENT_PLAYER_HEAL:
            logEntry.target = 'PLAYER';
            break;
        default:
            // In a switch statement, we also have a default case which is executed if no case matches
            // In this case let's return empty object
            logEntry = {};
    }

    // Finally we need to push this log Entry to the array
    eventLogs.push(logEntry);
}

// We display logs when the button is pressed
logBtn.addEventListener('click', logHandler);
function logHandler() {
    // We can use loops here. Let's see how we can do this with for loop
    for (let i = 0; i < eventLogs.length; i++) {
        // Here we initialize i to 0, and we check if i is less than length of eventLogs,in which case we run the code
        // At the end of the block, the value if i is incremented by the last statement, and then it is again checked
        // So this runs as many times as there are entries in the log
        // We can customize the for loop as we want. Using for (;;) {...} is valid, and would cause an infinite loop
        // We can also omit a certain part, like using for(let count = 10; count>10;){count--; ...}
        // This way the count variable is decremented at the start rather than at the end
        // console.log(eventLogs[i]);
    }

    // Since we have an array, a more preferred method would be using for...of which is made for arrays
    let i = 0;
    for (const log of eventLogs) {
        // We can use const here because every time the loops runs, a new log constant is created instead of the old one
        // In this case, we don't have the index variable, which we used to have with the for loop
        // We can create our own, by initiating a variable before the loop, then incrementing it inside the loop
        i++;
        console.log(`#${i}`);
        // This lets us keep track of the entry we log out
        // console.log(log);

        // We can nest loops inside loops, or anything else, like if-statement, function etc can have loops inside them
        // We can similarly use the for...in loop here to access the log object we get from the for...of
        for (const key in log) {
            // NHere log.key doesn't work because log doesn't have a key called key. key instead has the key as string
            // We can use strings or variables containing strings in the object[key] format
            console.log(`${key} => ${log[key]}`);
        }
    }

    // We also have while loops and do...while loops which run as long as a condition is met
    let j = 3;
    while (j < 3) {
        console.log('ran');
    }
    // This while loop will not get executed because j<3 is false when j=3.If I set j = 2,
    // it becomes an infinite loop because it is never false. We prefer for loops for these cases, but when we have a condition
    // that might become false from inside the block, we can use while
    do {
        console.log('do ran');
    } while (j < 3);
    // The while block didn't run, but this one does, because it runs the code once, then checks for the condition
    // since the condition is false it only runs once

    // We can use break keyword to stop a loop early. If we have a variable to keep track of the index of log shown
    // We can log out one log at a time by using th break statement to break out once logged a time
    // for (log in eventLogs) {
    //     console.log(log);
    //     break;
    //     // This would break after a single log, usually the first one
    //     // But if we had a variable logNumber which incremented itself each time, and used as index, we could log one at a time
    // }

    // We also have the continue keyword, which we can use to skip the current iteration after the continue keyword
    // So if we wanted to skip the logs for game over, we could use:
    // for (log in eventLogs) {
    //     if (log.event === LOG_EVENT_GAME_OVER) continue;
    //     console.log(log);
    // }

    // Something we might use rarely but is a feature in JS is labeled statements
    // We can add labels to statements with label_name: statement , and it is useful in the case of loops
    // What if we're in a nested loop but we want to break out of the outer loop, while we're in the inner loop?
    // We can add label to the outerloop then use break outerloopLabel to break out of the outer loop
    outerLoop: for (let i = 0; i < 3; i++) {
        let j = 2;
        innerLoop: while (i > 0 && j > 0) {
            console.log(`i => ${i}`);
            if (i === 2) {
                break outerLoop;
            }
            j--;
        }
    }

    // console.log(eventLogs);
}

// Logical Operator Tricks and Shortcuts
// Instead of simply using if or ternary operators, we can also make use of tricks allowed by JS to do some actions

// 1. !! (Double negation/ Double bang operator)
// This converts a truthy/falsy value to an actual true/false boolean, eg. !!"" = false, !!34 = true, !!['grapes'] = true, etc
// This works because ! converts a value into boolean but negates it, we can use the second ! to get the actual boolean

// 2. Default value using ||
// We can use the OR operator || to initialize something with a default value eg. const name = userInput || 'John'
// Since || doesn't need to return a boolean, it returns the first value which is true/truthy, starting from the left
// So in this case, if userInput was empty or  undefined, the default value for name would be 'John'

// 3. Conditional value using &&
// Similar to ||, the && operator doesn't need to return a boolean, we can use it as: const user = isLoggedIn && 'John'
// If the user is logged in i.e. the boolean(value at the start) is true(truthy), the second value is returned
// But if the first value is false(falsy), then the result of the expression is the first values

// Loops
// We need a way to execute a block of code or a function multiple times, else we need to write 10 function calls to repeat 10 times
// Instead we can use loops. There are mainly four types of loops available in JS:

// 1. for loops: The oldest and most used: it is used to loop over a block of code for a fixed number of times, using a counter
// It looks like: for (counter = initial_value; counter final condition, counter increment) {code}
// eg. for(let i = 0; i < 5; i++) {console.log(i)} logs out values from 0 to 4

// 2. for-of loops: These are new additions, and help to loop over all the elements in an array
// It looks like: for (element of array) {code}         eg. for (item of books) {console.log(item.name)};

// 3. for-in loops: These are similar to for-of loops, but instead loop  over all the keys of an object
// It looks like: for (key of object) {code}            eg. for (k in book) {console.log(book[k])};
// In this code, the book[k] is a way to access values of a key by using the key as a string/in a variable rather than dot notation

// 4. while loops: It is used to loop over a block of code as long as a certain condition is true
// It looks like: while(condition) {code}               eg. while (!gameOver) {... if (health<0) gameOver = true ...}

// Error Handling: Some errors are unavoidable, like user errors, network errors, etc, but we can use throw...catch to handle them
