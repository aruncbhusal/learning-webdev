/* Let's first handle the clicks, like we did in experiment.js */
var allDrums = document.querySelectorAll('button.drum');

for (var i = 0; i < allDrums.length; i++) {
    allDrums[i].addEventListener('click', function () {
        // The course plays audio before animation, but I believe we should animate before audio, not that there's much of a delay
        animateButton(this.textContent); // Used a textContent instead here
        // We had a switch statement here, but since we needed the switch for both click and keyboard events, we made a function for it
        playAudio(this.innerHTML);
        // I could also have used textContent, but just following the course here
    });
}

// Similarly let's also add the key press event, this one doesn't even need a loop
document.addEventListener('keydown', function (event) {
    animateButton(event.key);
    playAudio(event.key);
});

/* The module is complete, but one thing bothers me, in her solution, she creates audio objects each time a key is passed
But that I think would slow down the process. I think I should instead bring the declarations outside
That way we can simply call the method instead of creating everything each time we want to play the audio */
var tom1 = new Audio('./sounds/tom-1.mp3');
var tom2 = new Audio('./sounds/tom-2.mp3');
var tom3 = new Audio('./sounds/tom-3.mp3');
var tom4 = new Audio('./sounds/tom-4.mp3');
var kickBass = new Audio('./sounds/kick-bass.mp3');
var snare = new Audio('./sounds/snare.mp3');
var crash = new Audio('./sounds/crash.mp3');
// As I was bringing these above, I realized I had named all of them tom1, and was only spared because they were created and used one at a time
function playAudio(drumKey) {
    switch (drumKey) {
        case 'w':
            tom1.play();
            break;
        case 'a':
            tom2.play();
            break;
        case 's':
            tom3.play();
            break;
        case 'd':
            tom4.play();
            break;
        case 'j':
            kickBass.play();
            break;
        case 'k':
            snare.play();
            break;
        case 'l':
            crash.play();
            break;
        default:
            console.log(this.innerHTML + ' was pressed.');
        // This was not needed and probably will never get executed but adding it for good measure
    }
}

/* Apart from playing the sound, it would also be nice to know what was pressed/clicked with an animation on the button
For that we need to create another function, since we want to add the animation for both click and key events */
function animateButton(drumKey) {
    /* A class called .pressed is already created, we just need to add that class to the button
    Also each drum button has a class with its key name, we can use it to select the drum button to animate */
    var pressedButton = document.querySelector('.' + drumKey);
    console.log(pressedButton);
    pressedButton.classList.add('pressed');

    /* Slight problemm: now the button looks like it's continuously pressed. We need a way to reverse this addition of class
    JavaScript has a function called setTimeout that allows us to do just that
    https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout
    It accepts a function, time in milliseconds to delay, and optional function parameters */
    setTimeout(function () {
        pressedButton.classList.remove('pressed');
    }, 100);
    // So the class will be removed 100ms after adding.
}
