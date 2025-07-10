# JavaScript and its behind the scenes

This module covers the recent development (~2015) in JS, and how JS works

### ES5 vs ES6

ES stands for ECMAScript, the standardized language which is followed while making JS implementations. It is under active development, and during this, there have been many versions. But the biggest change came in 2015 from ES5 to ES6. ES6 and later is often called "Modern JacaScript".

ES5 had support for almost all browsers, ES6 can (mostly) be transpiled into ES5 but it supports most modern browsers, not ancient ones. Until ES6 was introduced, let and const keywords were not available, only 'var' was. Additionally, many new features were added to the language in ES6 that made development faster, cleaner and better.

#### var vs let

let (and const) are new keywords introduced in ES6, and should be preferred over var. var is not removed from JS only because of compatibility issues which would break any code that uses var. Let's look at it in the example folder.

The major difference is that let and const are block scoped and var is function/global scoped. And, variables declared with var are hoisted, but ones with let/const are not.

### How does the Engine work

The JS Engine in a browser is different depending on the browser used, but the V8 (Chrome) engine does parsing and execution. The engine has an interpreter and a compiler (Just In Time). When the JS code is to be run, the interpreter parses the code line by line, converting it to byte code. Then the interpreter executes the program. Interpreter also creates a machine code which is then sent to the compiler, which starts the compilation side by side, this is what allows the JS to use Browser APIs (connection between JS and Browser Logic (C++)), and perform actions.

This is the [V8 Engine Working](https://hackernoon.com/javascript-v8-engine-explained-3f940148d4ef) and [SpiderMonkey Engine Working](https://firefox-source-docs.mozilla.org/js/index.html)

JS is worked on by [ECMA Int'l Technical Committee](https://tc39.es/), the browser APIs are worked on by [WHATWG](https://whatwg.org/). Inside the JavaScript engine are two parts, a heap, and a stack. The heap is the "permanent memory", where all the function definitions are stored. When a function is called, the function is added to the stack, which initially contains an anonymous base function. The function may call another function, which gets stacked (pushed) on top of current function. When the last function to be called is executed, it is finally removed(popped) from the stack. This push and pop occurs as long as call stack is not empty.

We can look at this behavior in the Browser's Developer Tools inside the debugger by adding breakpoints as well, which shows us the call stack at the point. We also have something in the browser rather than the language called the event loop, which handles any events that occur in the browser like click or hover. When we add something to the event loop, it gets executed after the call stack becomes empty. This is not what the code itself does, but it communicates with the browser API to perform the task.

### Primitive vs Reference Values

Primitive values are the types: String, Number, Boolean, undefined, null and Symbol. They are generally small so they are stored normally on the stack, and the values themselves are stored. So when we try to assign it to another variable/constant, only the value is copied into the new variable/constant.

In case of reference values, it includes all the other types like objects, arrays, etc. Since they are large, so storing the entire values in the variables may not be possible. So the actual values are stored in the heap, but the variables themselves only store a pointer(address/reference) to the actual data. Due to this, copying the variable (assigning it to a new one) only copies the address. The implication is that modifying one copy will affect the other since they both point to the same memory. This is why comparing two identical objects yields false, because the variables store address, which is different for both.

In order to copy only the values of an object or array, we can use the spread operator { ...original } or [ ...original ]

### Garbage Collection and Memory Management

Our memory is not infinite, and we may run out of memory when running our program. In order to ensure we only store what we're using, we use garbage collectors. Every engine has its own [garbage collector](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Memory_management). In V8, it works by regularly checking if there are any objects with no active references. When we create a new object, we have a variable that references it, but if we set that variable to, say, null. Then the reference to the actual object is lost, and eventually the V8's garbage collector removes that object and frees up space. Further detail on [how it works can be found here](https://v8.dev/blog/free-garbage-collection). But there are cases where memory leaks might occur, i.e. keeping references to objects that won't be used again. An example would be adding event listeners inside a function, since event listeners can be stacked, we can add multiple event listeners with their own functions, which take up space in the heap. We should minimize memory leaks.
