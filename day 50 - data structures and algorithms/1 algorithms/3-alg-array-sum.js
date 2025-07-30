// We can take another algorithm, one that sums up all elements of an array
function sumUp(nums) {
    let sum = 0;

    for (let i = 0; i < nums.length; i++) {
        sum += nums[i];
    }

    return sum;
}

// In this function the size of input i.e. length of the nums array determines how many times the loop will run
// This means that the time complexity is O(n) or linear

console.log(sumUp([5, 7, 3]));

// More time complexities:
// Constant: pushing an item onto an array with push() doesn't depend on array length
// Linear: finding the max item in an array, should loop through all items to find it
// Quadratic: sorting an array, though there are ways to make it faster
// Logarithmic: An example is the binary search algorithm, which grows slower than the linear rate
// There are more as well, which we can look up
