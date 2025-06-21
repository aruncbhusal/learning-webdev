/* jQuery is a JavaScript library, which is basically code that someone else wrote, that makes our programming easier.
John Resig wrote jQuery, which makes querying for DOM elements a lot easier. It is the most used JS library.
If the JavaScript to select the heading element in the index file is:  */
document.querySelector('h1').style.color = 'red';
/* We can instead use jQuery to write it as:
    jQuery("h1")
or even more simply
    $("h1")
*/

/* Once we bring the jQuery into our document, we can finally use it.
if we have placed the script tags inside the head section, we can use the following to execute the JS only after the document has laoded fully */
$(document).ready(function () {
    $('h1').css('font-size', '3rem');
});
// But we generally put the script tags at the end of the body function so we don't need to use this method mostly

/* If we look at the jQuery file, we can see that it looks random, but it actually is because it is a minified version
All libraries come with a full version, and minified version, we can find them as separate files if we download jQuery instead
In a minified version, all blank spaces, newlines, comments are removed in order to make the file smaller
Since internet bandwidth is finite, we don't want to download/upload the entire file so we just send it in a way browser can understand
We can use minifier.org to convert our own JS/CSS code into minified versions */

/* In jQuery, there is no difference between selecting one element (using querySelector) and selecting all elements (using querySelectorAll) 
To select all the buttons in the html file we can use:
$("button")
*/

/* As seen earlier, we can use the .css method to change css styles in the format css(property, value)
We can also simply give property only, and the value will be returned. For example */
console.log($('h1').css('color'));
// This returns a rgb value for the color of the heading

/* We CAN manipulate styles using JavaScript, but should we? We need to separate our concerns, styling should be done with CSS
So similar to the past, we can create classes in the css, which we can apply using methods */
$('h1').addClass('blackbg');

// We can also add multiple classes using this method, by simply separating the classes with a space
$('h1').addClass('cursive padding-left-50');

// Similarly, we can check if an element has a class. it returns a boolean value, either true or false
console.log($('h1').hasClass('cursive'));

// And we can also remove the class easily
$('h1').removeClass('padding-left-50');

/* Not only styles, similar to what we could do in vanilla JS with textContent and innerHTMl, we can also do them here
When we select multiple elememts, like buttons above, we can use the method to manipulate all of them at once */
$('h1').text('Hellloooo');
// This is similar to textContent property of JS objects, and if we put html in here, it will appear as text without formatting

$('button').html('<em>Clicky Clicky</em>');

/* Similar to manipulating styles and classes, we can also use jQuery to manipulate the attributes
And here too, single parameter passed means the name of the attribute, and if two are passed, a value is in the second parameter */
console.log($('a').attr('href'));
$('a').attr('href', 'https://youtube.com');

/* Adding event listeners is also very easy using jQuery
We had to write a for loop to add event listeners to all elements one by one, but using jQuery we can simply add to buttons using: */
$('button').click(function () {
    $('h1').css('color', 'purple');
});

/* As well as this, we can have a keypress event handled using a similar process
Here, we can select the input tag or select the document tag like before
We have a challenge, to change the h1 to whatever is typed in the document. Let's do that challenge */
$(document).keypress(function (event) {
    $('h1').text(event.key);
});
// Here we cn use $("input") instead if we want the key presses on the input tag to be reflected on the H1.

/* Instead of these events, we can use any of the DOM events used in normal JS using the on() method which is similar to addEventListener */
$('h1').on('mouseover', function () {
    $('h1').css('color', 'yellow');
});

/* We can also create new elements using jQuery very easily. For that we can simply use: */
$('h1').before('<button>Before</button>');
// This adds the button right before the h1 element
$('h1').after('<button>After</button>');
// This adds the button right after the h1 element
$('h1').prepend('<button>Prepend</button>');
// This adds the button as the first child of the h1 element, even before the text
$('h1').append('<button>Append</button>');
// This adds the button as the last child of the h1 element

// Similarly, we can delete elements using remove method. Let's delete the last button.
$('.to-remove').remove();
// If we selected button, all the buttons would be removed.

/* We can also have animations, effects on the elements. I created specialized H2 for each of these, and specialized buttons for each */
$('.hider').click(function () {
    // $(".hide").hide();
    // $(".hide").show();
    $('.hide').toggle();
    // We can use hide to hide, show to show, but our button will be able to do both with .toggle
});

/* hide is abrupt, we may want to slowly fade the element in and out, we can use this instead: */
$('.fader').click(function () {
    // $(".fade").fadeOut();
    // $(".fade").fadeIn();
    $('.fade').fadeToggle();
});

/* We can also slide the element up and down */
$('.slider').click(function () {
    // $(".slide").slideUp();
    // $(".slide").slideDown();
    $('.slide').slideToggle();
});

/* These are predefined animations, but if we want to add animations ourselves, we can also use the .animate method
The method takes css rule inside curly braces, and it must be a numeric value, like opacity
It is because those are the values that can be gradually increased/decreased, compared to something like color or font-family
Also we can chain animations together, so if we want animations one after another or together, we can put them */
$('.animator').click(function () {
    $('.animate')
        .slideUp()
        .slideDown()
        .animate({ padding: '10%', fontSize: '3rem' })
        .animate({ padding: 0, fontSize: '1.5rem' });
});
