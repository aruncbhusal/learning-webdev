// Let's take an example of a problem, where we have an array of numbers as an input and the desired output is the minimum number
// The sequence of steps needed to get the desired output from the input is called an algorithm
// In this case, the array is an example of a data structure, which is a type of data which has certain rules, like arrays are ordered

// We need to be able to understand DSA for:
// being able to solve large problems which require complex algorithm formulations and sophisticated data storage techniques
// developing a problem solving mindset and learning to think logically
// being good at technical interviews

// Example Algorithm: Find the minimum number from an array of numbers
// A possible solution algorithm can be that we can loop through all the numbers in the array, holding the smallest one so far then return
// We can write it as
// currMin <== numbers[0]
// for each number of numbers
// if number < currMin then currMin = number
// end for and return currMin
// This is not something we can directly run as code, but it gives clear instructions for each line of code, so we call it pseudocode

// We can implement this in JS as well
function findMin(numbers) {
    // First we need to validate whether numbers is an array and its length is greater than 0
    if (!numbers.length) {
        // This checks for length = 0 and also checks for the length property's existence which validates an array
        throw new Error('A non-empty array is expected.');
    }
    let currMin = numbers[0];

    // We can return this value as the final result if length is 1, but instead we can write a loop that doesn't run when length is 1
    for (let i = 1; i < numbers.length; i++) {
        // This loop runs only when numbers.length is greater than 1
        if (numbers[i] < currMin) {
            currMin = numbers[i];
        }
    }

    // Finally we return the minimum value
    return currMin;
}

// We may also have another solution
// For this algorithm, we can sort the numbers in ascending order first and then simply return the first element
function findMin2(numbers) {
    // First let's copy the validator
    if (!numbers.length) {
        throw new Error('A non-empty array is expected.');
    }

    // Now we can sort the elements in the array. We can use JS's built in sort() method, but let's write one ourself
    for (let i = 0; i < numbers.length; i++) {
        // We need to loop through all elements in the array to ensure they're in the right position
        let outerElement = numbers[i];
        for (let j = i + 1; j < numbers.length; j++) {
            // For each position in the array, we need to check with all positions after it in the array to verify element in that position is correct
            let innerElement = numbers[j];
            // To do so we can compare the two elements and swap them if inner is smaller than outer i.e. bring inner element forward
            if (innerElement < outerElement) {
                // To swap we can simply set ith element to inner and jth to outer, and update the variables to reflect the change
                numbers[i] = innerElement;
                numbers[j] = outerElement;

                innerElement = numbers[j];
                outerElement = numbers[i];
            }
        }
    }

    // Finally we return the smallest number
    return numbers[0];
}

// But which method is better? For that we can take a look at how much time it takes to complete the operation
// But there may be vairance in the results based on device, internal mechanisms, compiler, etc
// So we instead measure this time in general terms, known as O(n) notation where we plot total time against number of elements

// In order to check the time complexity of findMin function we cann create a replica here and analyze it
// We need to see how many times each line of code/operation is executed
function findMinTest(numbers) {
    if (!numbers.length) {
        // Runs 1 time in total
        throw new Error('A non-empty array is expected.');
    }
    let currMin = numbers[0]; // 1 time

    for (let i = 1; i < numbers.length; i++) {
        // 1 time
        if (numbers[i] < currMin) {
            // numbers.length-1 times
            currMin = numbers[i]; // 0 to numbers.length-1 times
        }
    }

    return currMin; // 1 time
}
// We can divide the algorithm into three blocks here, setting up, actual logic, and closing
// We can add up the number of iterations for all, considering we have arbitrary number of lines. Then the time for this one can be written as:
// T = c1 + (n-1) c2 + c3
// here c1 is a constant number of times in the setting up phase, c2 is the actual looping logic which runs n-1 times, c3 is closing constant
// We can write this as T = n c2 since c1 and c3 are very small when n is large, and n-1 and n are almost equal for larger values
// Thus this algorithm can be said to have O(n) => Linear time complexity

// Now for the findMin2 function, we can see that the outer loop runs n times, and inner runs n times in each outer iteration
// This means the cmplexity is T = O(n^2) which is quadratic time complexity.

// This means that the time consumed by findMin grows linearly with time, but that of findMin2 grows quadratically, which is very different
// in terms of time needed, so we prefer findMin before findMin2

// Cases:
// We can look at different cases, since they can result in different total operations by an algorithm
// Best Case: the case is best when for loop isn't executed, then we have constant time complexity, written as O(1)
// In worst case, the data is completely unordered and we need to solve if with all steps, making it O(n)
// But we're more interested in average time complexity which is when arbitrary values are present in the array

// For findMin2, the loops run regardless and they run with O(n^2) complexity, for pre sorted, we don't run the if-block statement
// Worst and average too are O(n^2) but generally larger than best

const min = findMin([5, 7, 2, 4]);
const min2 = findMin2([5, 7, 2, 4]);
console.log(min);
console.log(min2);

// I think this is it for today, will need to continue the rest tomorrow
