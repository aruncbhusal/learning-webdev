/* I had fun building my game, took me about 1.5-2 hours to get it done, not bad
Anyway I want to build it again, but this time follow the course instructions, this way I do it as it was intended
No experimentations this time around */

// Step 2.2: New array buttonColours with the color names
var buttonColours = ['red', 'blue', 'green', 'yellow'];
// Step 2.4: New empty array for game pattern
var gamePattern = [];
// Step 4.2: New empty array for user clicked pattern
var userClickedPattern = [];
// Step 7.1(hint): A variable to be toggled once game starts so further key presses don't interfere
var started = false;
// Step 7.2: A level variable that starts from 0
var level = 0;

// Step 2.1: Inside new function nextSequence, generate random number 0-3
function nextSequence() {
    // Step 8.6: Reset the user pattern for the next step
    userClickedPattern = [];

    // Step 7.4: Increase level by 1 and update the title
    level++;
    $('#level-title').text('Level ' + level);

    var randomNumber = Math.floor(Math.random() * 4);
    // Step 2.3: Choose a random color using random number
    var randomChosenColour = buttonColours[randomNumber];
    // Step 2.5: add the randomly chosen colour into the game pattern
    gamePattern.push(randomChosenColour);

    // Step 3.1: use jQuery to select button with same id as random color (link to id selector docs was given as hint)
    // Step 3.2: Search on google/StackOverflow to make the button flash (why was the .pressed given anyway?)
    $('#' + randomChosenColour)
        .fadeOut(100)
        .fadeIn(100);

    // Step 3.2: Use Google/StackOverflow to play the sound for the button selected
    // Step 5.3: Take the sound playing code inside the playSound function
    playSound(randomChosenColour);
}

// Step 4.1: Detect when any button is clicked and store the id of the button clicked into a variable
// (Later checked - all steps for this given as hints)
$('.btn').click(function () {
    // var userChosenColour = this.id;
    // The course hint has something about attr method but I don't see where it might be used
    // Oh I looked at the docs and found out, we could do this:
    var userChosenColour = $(this).attr('id');

    // Step 4.3: Add the user chosen color into the user pattern
    userClickedPattern.push(userChosenColour);
    // console.log(userClickedPattern);

    // Step 5.1 Play a sound when user clicks on the button, make it in a function
    playSound(userChosenColour);
    // Step 6.3: Make sure the animation occurs when a user clicks
    animatePress(userChosenColour);

    // Step 8.2: Call checkAnswer with index of last answer
    checkAnswer(userClickedPattern.length - 1);
});

// Step 5.2: playSound function to play a sound, takes button name as input
function playSound(name) {
    var audio = new Audio('../sounds/' + name + '.mp3');
    audio.play();
}

// Step 6.1: New function to animate press, takes input current color
function animatePress(currentColor) {
    // Step 6.2: Add pressed class to the button of current color and remove it after 100 ms
    // Now I understand, her goal was to have different animations for the randomly generated color and user clicked color, nice
    $('#' + currentColor).addClass('pressed');
    // She hinted to look at StackOverflow for the "remove after 100ms" part. Makes sense, she only covered setTimeout for like 3 mins
    setTimeout(function () {
        $('#' + currentColor).removeClass('pressed');
    }, 100);
}

// Step 7.1: Detect a keyboard key and call nextSequence when it is called for the first time
$('body').keypress(function () {
    // Using keypress instead of keydown because that is what was in the module, should use keydown otherwise
    if (started === false) {
        // Because !start hasn't been taught yet
        started = true;

        // Step 7.3: Change title to Level 0 to start game
        // (later seen in hint - use id to select the heading)
        $('#level-title').text('Level 0');

        nextSequence();
    }
});

// Step 8.1: New function checkAnswer with current level as input
function checkAnswer(currentLevel) {
    // Step 8.3: Use if statement to check if most recent user answer is the same as game pattern and log its output
    if (userClickedPattern[currentLevel] === gamePattern[currentLevel]) {
        // console.log('Success');
        // Step 8.4: Use another if to check if user has finished their sequence
        if (userClickedPattern.length === gamePattern.length) {
            // Step 8.5: Call nextSequence with a 1 second delay
            setTimeout(nextSequence, 1000);
        }
    } else {
        // console.log('Wrong');

        // Step 9: Play the wrong.mp3 sound, add game-over class to body and remove after 200 seconds, and change h1 title to Game Over
        // I didn't see the game over class in my implementation, whoops
        var wrongAudio = new Audio('../sounds/wrong.mp3');
        wrongAudio.play();
        $('body').addClass('game-over');
        setTimeout(function () {
            $('body').removeClass('game-over');
        }, 200);
        $('#level-title').text('Game Over, Press Any Key to Restart');

        // Step 10.2: Call the startOver function when game over
        startOver();
    }
}

// Step 10.1: New startover function where we reset the level, game pattern and started variable
function startOver() {
    level = 0;
    gamePattern = [];
    started = false;
}
