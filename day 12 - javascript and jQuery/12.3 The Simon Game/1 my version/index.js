/* Okay the first thing I'm thinking of doing is first making it interactive
I'll be taking the reference of the given game, without looking at the code, trying to reverse engineer what is happening
First I'll apply the pressed class, and add sounds to the buttons */

/* Like in the drums, I want to separate the audio object creation to the outside, because it may be inefficient
if I wanted to create the object each time pressButton is to be called */
var greenSound = new Audio('../sounds/green.mp3');
var redSound = new Audio('../sounds/red.mp3');
var yellowSound = new Audio('../sounds/yellow.mp3');
var blueSound = new Audio('../sounds/blue.mp3');
var wrongSound = new Audio('../sounds/wrong.mp3');

// For the game, I think we need two empty arrays, one to hold the current sequence, one for user entered sequence
var gameSequence = [];
var userSequence = [];

$('.btn').click(function () {
    // For any button, a click must trigger a small time where .pressed is on
    pressButton(this.id); // I don't think she has covered this yet, but well...
});

// The reference game doesn't have keyboard mapping but I'll add it for convenience.
$('body').keydown(function (event) {
    /* I just thought of something interesting. Instead of calling pressButton
    what if I clicked the button when a specific key is pressed? It would be very slow but this is what I'd imagine it would be like:
    if (event.key === 'w') {
    $("#green").click();
    } ... and so on
    But since I'm adding this functionality so that it gets faster and easier than clicking, I'll avoid going that route */
    var pressedKey = event.key;
    switch (pressedKey) {
        case 'q':
            pressButton('green');
            break;
        case 'w':
            pressButton('red');
            break;
        case 'a':
            pressButton('yellow');
            break;
        case 's':
            pressButton('blue');
            break;
        default:
            // Usually I would console.log but this time I'l just break
            /* If I don't pass anything to pressButton, I need to add a condition to start the game in two places
            I think I should instead consolidate them by sending at least something there */
            pressButton('start');
            break;
    }
});

function pressButton(button) {
    // Doesn't matter which button it is, this function handles them all, in fact it also lets us allow any keyboard mappings

    /* Since we're acting upon the value to this function, I will need to start the game here */
    if (gameSequence.length === 0) {
        console.log('Game start!');
        playGame('start');
        /* I think I should be clever here, and create a new button value called wrong, so I can play its sound below
        Since we're only going to exit from this function once the game is over
        But nah I'll just create a new function called gameOver to handle that, much cleaner that way */
    } else if (button === 'start') {
        // We don't want to anything when the button pressed is not what makes any sound
    } else {
        /* I had the logic for playSound here but since I need to call it both from the game logic as well as the user,
        I thought it would be better if I just separated it to another function entirely
        I think I should instead check for right or wrong press here, and pass a value "wrong" to it so it can play wrong sound */
        if (button !== gameSequence[userSequence.length]) {
            button = 'wrong';
        }
        playGame(button);

        /* I think I will need to redo this game in the way it was intended to be done
        I have made many clever changes to it to suit my style of programming */
    }
}

function playSound(button) {
    // First let's handle the "animation"
    $('#' + button).addClass('pressed');
    setTimeout(function () {
        $('#' + button).removeClass('pressed');
    }, 100);
    /* I had to put this in the else block because I we don't have any element with the id #start
            And I don't want this to break my game */

    /* I was going to make a switch statement here, but since the filenames are literally the same as ids, let me do it directly
    okay on second thought, it may not be possible because I can't change which variable to call dynamically, at least yet, 
    so I think I'll need to resort to switching here */
    switch (button) {
        case 'green':
            greenSound.play();
            break;
        case 'red':
            redSound.play();
            break;
        case 'yellow':
            yellowSound.play();
            break;
        case 'blue':
            blueSound.play();
            break;
        case 'wrong':
            wrongSound.play();
            break;
        default:
            console.log('pressButton received: ' + button);
            break;
    }
}

/* Okay now the interactivity part is done, time to implement the game logic, initially game hasn't started
Let's create a function that is entered when the game is started
But the first press should only start the game */

var buttons = ['green', 'red', 'yellow', 'blue'];
function playGame(button) {
    switch (button) {
        case 'wrong':
            gameOverSequence();
            break;
        case 'start':
            setTimeout(newLevelSequence, 500);
            break;
        default:
            userSequence.push(button);
            if (userSequence.length === gameSequence.length) {
                setTimeout(newLevelSequence, 500);
                playSound(button);
            } else {
                playSound(button);
            }
            break;
    }
}

function newLevelSequence() {
    console.log('Starting new level...');
    /* I don't know if the course solution has this, but I need to freeze the pressing ability until game sequence is shown */
    var newButton = buttons[Math.floor(Math.random() * 4)];
    gameSequence.push(newButton);
    playSound(newButton);
    $('#level-title').text('Level ' + gameSequence.length);
    userSequence = [];
    console.log(gameSequence);
}

function gameOverSequence() {
    playSound('wrong');
    gameSequence = [];
    userSequence = [];
    $('#level-title').text('Game Over. Press A Key To Restart!');
    $('body').css('background-color', 'red');
    setTimeout(function () {
        $('body').css('background-color', '#011F3F');
    }, 200);
}
