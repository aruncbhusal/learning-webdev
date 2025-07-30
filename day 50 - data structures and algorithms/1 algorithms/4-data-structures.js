// We have different data structures in JS, for which we have different possible operations, methods
const name = 'Grace';
// This is a string, a more general data structure instead would be an array
const numbers = [4, 5, 6, 7];

// There are different operations that can be performed on the array which have their own time complexities
// For example, the push() method adds an element to the end of the array, which doesn't affect any other elements
numbers.push(8);
// So this has a constant time complexity, because no matter how many elements there already are, adding one more to the end would be same time

// but the unshift() method which too adds a new element to the array, but at the start,affects the other elements as well
// Since the element in index 0 has to now be shifted to index 1 and so on, until all elements are moved, before inserting the item
numbers.unshift(3);
// So this has a linear time complexity

// Each element of an array has its own index, so to access an element in an array, we can simply use
console.log(numbers[1]);
// This directly gets the element we need, making it a constant time operation

// But what if we have an array of objects, where we need to search based on a condition
const fruitInventory = [
    { fruit: 'apple', stock: 5 },
    { fruit: 'cherry', stock: 3 },
    { fruit: 'pear', stock: 9 },
];
// in this case if we need to find how many cherries we have we can use the find method which iterates through the array
console.log(fruitInventory.find((item) => item.fruit === 'cherry').stock);
// This is a linear time operation, best time complexity is constant when cherry is at the first of the list,
// but on worst and average case, the time complexity is O(n)

// But instead what if we utilized an object instead
const fruitStocks = {
    apple: 5,
    cherry: 3,
    pear: 9,
};
// In this case we can simply pull the stocks of cherry using
console.log(fruitStocks.cherry); // or fruitStocks['cherry']
// This would be a constant time operation

// Similarly if we had something else like an object as key, then we could use a Map data structure built into JS
// In this way we can use different data structures based on our use case that would provide performance benefits over other

// https://github.com/trekhleb/javascript-algorithms
// We can look at this resource to learn more about algorithms with JS
