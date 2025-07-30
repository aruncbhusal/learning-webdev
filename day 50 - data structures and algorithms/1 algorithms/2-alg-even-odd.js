// Let's now take an algorithm that tells us whether a number is even or odd
function isEvenOrOdd(number) {
    // We can check if it is divisible by 2 using modulo division
    // const result = number % 2;
    // If result is 0 it is odd, and 1 then even, so we can just write an if statement
    // if (result === 0) {
    //     return "Even";
    // } else {
    //     return "Odd";
    // }
    // Since all the lines in the function run at most one time i.e. don't depend on the passed parameter,
    // It can be said to have constant time complexity => O(1)

    // But we can also write it another way as:
    return number % 2 ? 'Odd' : 'Even';
    // Since it returns 1 or 0, and 1 is truthy, 0 is falsy, we can simply use the ternary operator for this
    // It has the same time complexity being run only once, but there might be cases where single line may not be linear in complexity
}

console.log(isEvenOrOdd(4));
console.log(isEvenOrOdd(9));
