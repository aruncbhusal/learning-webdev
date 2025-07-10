// JavaScript is a forgiving language, it allows us to use a variable without declaring it, by helpfully implicitly adding var keyword before it
// It even allows us to create a variable using var, withe a reserved word, like 'undefined'
// In order to avoid these malpractices, we can use strict mode, which doesn't allow room for such bad code
'strict mode';
// Strict Mode: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#changes_in_strict_mode

// We can use let and var in similar cases, we can replace let with var mostly and it works
// First: We can redeclare a var as much as we want
var name = 'Glenn';
// var name = 'Steve';
// It simply overwrites the data inside the variable and creates the variable

let age = 14;
// let age = 19;
// But when using let, we're not allowed to initialize twice. We can reassign but not redeclare

function example() {
    // What if we declare new variables here
    var name = 'Hylos';
    let age = 25;
    // This is fine, because we're in a function so let allows overwriting as well
    // But if we have a block, like an if block
    if (age > 20) {
        let log = 'Old';
        var canVote = true;
    }
    console.log(canVote);
    // console.log(log)             => This won't work, because let is block scoped, while var is function/global scoped
    // A block is contained within the curly braces
}
// We don't even need something like an if to create a block. We can simply use:
{
    let i = 5;
    console.log(i);
}
// Here the variable i has already gone out of scope.

// Another concept is hoisting, which applies to var, but not for let and const
// When we use a variable like:
console.log(userName);
// console.log(userAge);            => This throws a Reference Error

var userName = 'Mahesh';
let userAge = 98;
// In the case of var, the browser brings all the var variables to the top of their scope, this is called hoisting
// They are defined as 'undefined', then the value is set when the line is executed, so the above log shows undefined not name

// Primitive types store values but Reference Types store addresses. This is why when we:
const list = ['Orange'];
const newList = list;
list.push('Apple');
// Even though list itself is a constant, being a pointer, the memory it points to doesn't have to be a constant, so we can add
console.log(newList);
// We can see that this new list has both Orange and Apple even though we copied the list when it only had orange
// This is because newList and list point to the same address

// If we want to create an actual copy, we can use:
const newnewList = [...list];
list.push('Mango');
console.log(newnewList);
// This time it only has orange and apple because we only copied the values from the array using the spread operator
