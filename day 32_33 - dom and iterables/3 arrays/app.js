/* Iterables: Objects that implement the 'iterator' protocol and have an @@iterator method eg. Symbol.iterator
They are basically objects with which we can use for...of. Arrays, Array like objects, Strings, Set, Map, etc are iterables
Array-like objects: Objects that have a length property and can be accessed using index. These are not arrays, but share this property
NodeList, String, HTMLCollection.. are Array-Like objects */

// Creating Arrays (Initialization)
// There are many ways to create an array, the most used one being this definition
const numbers1 = [4, 5, 6];
console.log(numbers1);
// We can also have a comma after the last number
// Another way to create array is using a constructor function with the new keyword
const numbers2 = new Array(4, 5, 6);
console.log(numbers2);
// In this case we're passing the items of the array inside parameters of this constructor
// If we have only a single parameter, it is not treated as an array element but instead the length of the array
// We can also omit the new keyword and it behaves the same. We can create an empty array of some length
const numbers3 = Array(5);
console.log(numbers3);
// And we can also create arrays using the from() method of the Array object. It takes an iterable/array-like object as a parameter
// And creates a new array from the elements in that iterable
// We have a list in the html, we can use it to get a nodelist and convert it to array
const notyetnumbers4 = document.querySelectorAll('li');
console.log(notyetnumbers4);
const numbers4 = Array.from(notyetnumbers4);
console.log(numbers4);

// Storing in an array
// We have seen that we can store items of same type in an array
// We can also store items of different types
const jungle = [5, 'elephant', { name: 'Patapim' }];
// We can also have multidimensional arrays (arrays inside arrays inside arrays inside ....)
const inception = [
    [
        [1, 2],
        [3, 4],
    ],
    [
        [5, 6],
        [7, 8],
    ],
];
// In this case we CAN store other items inside this array, but in order to use this with nested loops (for...of for arrays inside)
// We need to ensure all the items we want to loop on are actually iterables, else we will get an error. Here we can run
for (layer1 of inception) {
    for (layer2 of layer1) {
        for (layer3 of layer2) {
            console.log(layer3);
        }
    }
}
// This logs out from 1 to 8

// Adding elements to an array
// We can add new elements to the end of an array using push() method, and at the beginning using unshift() method
const sports = ['football', 'hockey'];
console.log(sports);
sports.push('cricket');
console.log(sports);
sports.unshift('badminton');
console.log(sports);
// They return the new length of the array, in case we need it. unshift operation is slower than push because
// it adds an element to the start, and all existing elements will be unshifted (shifted to the right)

// We can remove the last and first elements as:
const lastItem = sports.pop();
console.log(sports, lastItem);
const firstItem = sports.shift();
console.log(sports, firstItem);
// shift is slower than pop for the same reason, and they both return the removed element

// We can replace an element in the array using the index notation
sports[1] = 'tennis'; // This replaces hockey with tennis
console.log(sports);
// We can also add elements to non existent indices and they will be created, all items between the last item and this item will be empty
// sports[4] = 'volleyball';
// console.log(sports);

// Splice method
// It can be used to delete/replace elements in an array. It only works with an array and not iterables or array like objects
// We can use it to add an element to a specified location as
sports.splice(1, 0, 'basketball');
// The first parameter is the start index. so this starts from the second element
// The second parameter defines the number of items to delete, here we have set it to zero because we only want to add
// The third and so on parameters take the replacement value for the deleted items
// Since we haven't deleted anything, this will simply add 'basketball' to the second position before tennis
console.log(sports);
// We can use it to remove elements from an array by not specifying the replacement parameters
// When it deletes, it also returns the deleted items
sports.splice(-2, 1);
// We can also give a negative start index value, this one goes to the 2nd to last value and deletes it only (single item)
console.log(sports);
// Even the number of elements to delete is not needed, we can just give an index and it will delete all items from that index onwards
sports.splice(0);
// This deletes all items starting from index 0  i.e. now the array is empty
console.log(sports);

// Slice method
// Since arrays are reference type, anything that is initialized to an array variable has the same reference and any change is replicated
// But using slice we can create a copy of the array that will be different in reference from the original array
const fruits = [
    'apricot',
    'banana',
    'cherry',
    'dragonfruit',
    'eggfruit',
    'cherry',
];
const alsoFruits = fruits;
const notFruits = fruits.slice();
console.log(fruits === alsoFruits); //returns true
console.log(fruits === notFruits); //returns false
// We can also use it to select specific items from an array. We can use it to return only 2nd and 3rd element using
console.log(fruits.slice(1, 3));
// The first is start index, the second is end index, but end index is not included, so it gives us elements from index 1-2
// We can also only give the start index to get all the elements.
console.log(fruits.slice(2));

// To create a new array element by adding elements to an existing array, we can use the concat method which takes an array
const fruitsAndVeg = fruits.concat(['fenugreek', 'gourd']);
// It adds the elements inside the arrays instead of adding the array as a new eleming like push()
console.log(fruitsAndVeg);

// Find the index of a search item inside an array
// We can use the indexOf method to find the (first) occurence of a primitive type value inside an array
console.log(fruits.indexOf('cherry'));
// If we try to use it with reference values, it will give -1 because it is the last element, and two identical objects don't have same ref
// Since we have two 'cherry' item in the fruits array, we can instead use lastIndexOf to search from the right side
console.log(fruits.lastIndexOf('cherry'));

// What if we're looking for an object that has a certain value match, or something else that we can't simply use indexOf for
// We can use find and findIndex, which take a function as parameter, and that function can take array item, index and full arry as args
const people = [
    { name: 'Dan' },
    { name: 'Stan' },
    { name: 'Rose' },
    { name: 'Jose' },
];
const foundPeople = people.find((person, idx, people) => {
    return person.name === 'Stan';
});
console.log(foundPeople);
// The findIndex method works the same
const foundPeopleIndex = people.findIndex((person, idx, people) => {
    return person.name === 'Stan';
});
console.log(foundPeopleIndex);

// includes() : To check if an item exists in an array, without caring for the index or item
console.log(fruits.includes('dragonfruit')); // This returns true

// forEach : Alternative to for loops
// If we want to act on each element of an array, we can use the forEach method which takes a function as parameter as well
// Let's create an array that has the lengths of the fruit names in the fruit array
const fruitLengths = [];
fruits.forEach((fruit, idx, fruits) => {
    // We can use the same name in parameters as the actual array because of shadowing inside the function
    fruitLengths.push(fruit.length);
    // It doesn't return anything
});

// map : New array from existing
// We can use the map method to create a new array and return automatically instead of pushing each time
// This is good if we want to use each element of an array to shape another array. Let's say we have an array of product costs
const productCosts = [4.2, 6.8, 11.5, 2, 3.5];
// We can use the mao method to create a new array with 13% tax added as well
const taxedProductCosts = productCosts.map((cost, idx, costs) => {
    return cost * 1.13;
});
// Note: all parameters are not compulsory, we can simply take cost only, or none at all even

// sort and reverse
// The sort method takes an array and treats everything as a string, then orders it. But if we don't want default behavior, we can pass function
// This function takes two values a and b. We return 1 for greater (should appear later) 0 for equal(order as is), -1 for smaller
console.log(productCosts.sort());
const ascendingCost = productCosts.sort((a, b) =>
    a > b ? 1 : a === b ? 0 : -1
);
console.log(ascendingCost);
// What if we want descending, one option is to use reverse condition, replacing 1 and -1 inside the sort function
// Or we can use (not preferred in this case) reverse method
const descendingCost = ascendingCost.reverse();
console.log(descendingCost);

// Filter: Keep some elements, but not all
// The find method gives us one element which matches the equality. But with filter we can set up a condiiton which if satisfied,
// the elements will be added to a new array which is returuned. Inmportant to note is that these return the references and not copies
const cheapProducts = productCosts.filter((cost, idx, costs) => {
    return cost < 5;
});
// Arrow functions can make these functions shorter and more compact
// Since we only need the current element here and we're only returning, we can simply use this line and it works as well
productCosts.filter((c) => c < 5);
console.log(cheapProducts); // Should show items less than 5 in value

// Reduce: from an array to a single value
// this method takes an array, and using a function, and an initial value as parameters, it works on each item of the array then reutns finally
const totalCost = productCosts.reduce(
    (prevValue, curValue, curIdx, costs) => prevValue + curValue,
    0
);
console.log(totalCost);

// We can also use method chaining to eliminate the need for temporary storage variables
// If we have an object from which we want to extract a certain property into an array, then reduce that array into a final result
// We can use: objectArray.map(i => i.property).reduce((p,c) => p+c, 0); to sum up all values that share property 'property'

// Working with strings: split and join
// When we have a string like a csv, we can convert it into an array by using split
const dataString = '1.3,Nepal,Yes';
const dataArray = dataString.split(',');
// We can add a delimiter which is separating the two elements we want to split, or it is assumed to be a whitespace
console.log(dataArray);
// We can also change something from a list to a string, for that we can use the join method
const newString = dataArray.join(' ');
// We can also specify the delimiters here, I chose a whitespace
console.log(newString);

// I think I will need to complete this tomorrow as it's already almost midnight now.

// New day
// Spread operator: ...
// It is similar to the rest operator, we can take an array and spread its elements into comma separated values
// It is useful when we need to copy an array
const newPrices = [...productCosts];
// If we now add a new entry to the product costs, it is not reflected in the newPrices array
productCosts.push(45);
console.log(productCosts, newPrices);

// But if an array contains objects i.e. references of the objects, the references are copied, not the objects
// So we can instead use map in conjuction with the spread operator to create brand new objects
const newPeople = [...people.map((person) => ({ name: person.name }))];
// Now we can change the name of a person in people array and it would not affect the new array
people[1].name = 'Sheela';
console.log(people, newPeople);

// Array destructuring
// What if we want to take all the elements in an array, or some, and store them in some variables/constants
// We can do so by using the destructuring syntax
const personArray = ['Jack', 'Rack', 30, 'Houston', { job: 'Plumber' }];
const [fName, lName, ...otherInfo] = personArray;
// This takes the personarray and stores the first two elements in the fName and lName constants, and the rest are stored as an array
console.log(fName, lName, otherInfo);

// Maps and Sets
// In JS there are three main iterable types: Arrays, Sets and Maps
// In Arrays and Sets, nested data of any kind can be stored. In Maps, the data are stored as key-value pairs, they may be any kind
// Each of them have their own special methods along with the common iterable methods
// Arrays store ordered data, duplication is allowed. Sets don't store ordered data, duplication is not allowed
// Maps are ordered as well, but duplication of keys is not allowed. Duplication of values is allowed. We access values using keys

// Sets
// They are used to store data which we don't want to be duplicated, for example ids or usernames
// In order to create a set, we can use the new Set() syntax, where if we leave parameters empty it creates an empty set
// Or we can pass an iterable of any type and it creates a set
const usernames = new Set(['groovypanda', 'magesticoak', 'crazyland']);
console.log(usernames);
// The most important method is has() which checks if the set has an item and returns a boolean
console.log(usernames.has('groovypanda')); // This should return true
console.log(usernames.has('dragonslayer')); // This should return true
// We can add or delete items from a set using add and delete methods.
// The add method doesn't give us any error if the item already exists
usernames.add('magesticoak');
// But we can add new ones easily
usernames.add('slyunicorn');
console.log(usernames);
// The delete method doesn't give us any error if the item doesn't exist either
// But we can use the has() to check if it exists
if (usernames.has('crazyland')) {
    usernames.delete('crazyland');
}
usernames.delete('fluentkoala');

// We can also get all the items in the set using the entries method which returns an iterable containing arrays with each item twice
for (const uname of usernames.entries()) {
    console.log(uname);
    // We can use indexing to get the actual single value
}
// We can also instead use the values() method to get the entries singly
for (const uname of usernames.values()) {
    console.log(uname);
}

// Maps
// Similar to sets, we can initialize it with en empty parameter list, but to initialize it we use an array of arrays
// The inner array contains two items: the key and the value. The key and the value can be any type
// It is useful to associate some data to an existing variable without modifying the variable itself. for example
let user1 = { username: 'Steve' };
let user2 = { username: 'Dan' };
// We can now create a new Map with only user1 as:
const userMap = new Map([[user1, { lastLoggedIn: 'Tuesday', age: 15 }]]);
console.log(userMap);
// In order to get an item from the map, we can use the get method
console.log(userMap.get(user1));
// We can see that we can use even an object as a key to get the value stored in it
// We can also add a new key value pair using set
userMap.set(user2, { lastLoggedIn: 'Sunday', age: 52 });
console.log(userMap);
// Similarly we can use the entries method like before to get all the key value pairs
for (const [key, value] of userMap.entries()) {
    // We can also use destructuring
    console.log(key, value);
}
// If we only want the keys, we can get them too using keys()
for (const key of userMap.keys()) {
    console.log(key);
}
// We also have other methods like delete to remove a single pair, clear to remove everything
// We can use size property to get the size of the map
console.log(userMap.size);

// Maps vs Objects: When to use what
// Objects can only use strings, numbers of symbols as keys but maps can use any daata type as keys and values
// Creating new objects has better performance than maps, but adding and removing to an object is more intensive
// Maps are preferred when there are a large number of key value pairs that need to be stored

// Variants of Set and Map: WeakSet and WeakMap

// A WeakSet only takes objects as its elements and supports lot less methods than a full set
const newWeakSet = new WeakSet();
newWeakSet.add(user1);
console.log(newWeakSet);
// The difference between WeakSet and a normal set is that normal set holds to the referenecs of objects even if the source has abandoned
// WeakSets are useful when we want to use an object temporarily then have an ability to garbage collect when we remove our references
user1 = null;
// Doing this will remove the reference for the object, and now the entry in the weakset is garbage collected by the browser on its terms
// console.log(newWeakSet);
// We don't usually control when the garbage collection occurs. In a normal set we would need to delete the entry, but it does it automatically

// WeakMap, similar to WeakSet, takes an object as a key and works on the same principle of garbage collection once unreferenced
const newWeakMap = new WeakMap();
newWeakMap.set(user2, 'eaten breakfast');
console.log(newWeakMap);
// Now if we set user2 to null, it will at some point garbage collect the reference held by the WeakMap and remove the entry
// In case of a normal map, we need to do it ourselves like
userMap.delete(user2);
// But here we can simply use:
user2 = null;
// console.log(newWeakMap);

// This is it for this module, took me lots of time I guess.
