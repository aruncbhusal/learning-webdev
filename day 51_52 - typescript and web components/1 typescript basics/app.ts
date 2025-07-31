// TypeScript is not a language you'd run on a browser or NodeJS but instead it is another language that can be compiled to JS
// It adds features to JS and makes development easier
// TypeScript builds up on JS, and is called a "superset" of JavaScript, which can be compiled to JS using specific tools
// One of the biggest additions it makes it static types. JS is a dynamic weakly typed language i.e. types are defined at runtime
// But in TypeScript, everything must have a fixed type

// In order to work with typescript we need to install the compiler for it
// We can visit https://www.typescriptlang.org/ for docs or instructions
// To install TS Compiler globally we simple use npm install -g typescript
// This installs it globally on our system, and we need npm (Node package manager) to install it
// After installation, we can create a .ts file but we need to write .js in the script tag since .ts can't be run on browsers

// In order to compile our TS Code to JS, we can use 'tsc <filename>.ts'  to convert to a js file

// In the add function, we may get strings or other types as parameters, while JS will just break the code, or produce a bug
// In the case of strings, it may concatenate them, which we don't want, but in TS we can specify types so it throws error
// Since the data types are fixed during compile time
// Also another feature added by TS is the ability to compile into "old JS" so that the code works on older browsers as well
function add(a: number, b: number) {
  // Here, we're defining a and b to be numbers and if we pass anything else, VS Code has inbuilt syntax highlighting to let us know
  // Or we can try compiling which gives an error directly.
  return a + b;
}

// But that isn't the only way we can work with types in TS, for instance in the next line here
const result = add(5, 3);
// The constant 'result' can also be assigned a type with const result: number since we're storing a number there
// But it isn't necessary in this case because TS has Type Inference where it knows what type we're working with
// Here, since the add function takes two numbers and returns their sum, it too must be a number, so the result constant should be a number
// If we instead use :string then it shows an error unless we convert the result to string
console.log(result);

// We also have function types, which are the types that can be returned from the function
// In the above function, we could also define it as function add(a:number, b:number): number
// This way we know that we're returning a number and get error otherwise, but it too can be inferenced so we don't need to use it
// What if our function has no return?
// What if we want to work with any type of parameter?

function printThing(thing: any): void{
  // In order to work with any type of parameter, here thing can be any type, we can use :any
  // But by using this, we're stripping away an important TS feature, and thus we should use it sparingly as a last resort
  // Also, the function return type is set to void which means we don't have anything returned (default is undefined)
  // We can set it to undefined, but it shows error because in that case we need to explicitly return undefined, so we use void
  // But in most cases it too is inferred so we don't need to use it all the time
  console.log(thing);
}

printThing(4);
printThing('Egg');
printThing({ animal: 'Gorilla' });

// We also have the boolean type, when used with const the type appears as either 'true' or 'false' because a const doesn't change its value
// But if we use let, we can see boolean type

// We can also override these type definitions, say we have an input field in the html
// Let's select the input elements and the button
const num1El = document.getElementById('num1') as HTMLInputElement;
// We can use the as keyword to cast a value to a certain type
const num2El = <HTMLInputElement>document.getElementById('num2');
// In order to cast, we can also use the angle brackets with element type inside

const submitBtn = document.getElementById('submit-btn')!;
// He mentioned the null value while explaining tsconfig, for which we can use the exclamation mark after the expression to ignore if null

// We can add interfaces for type security and to fix what should be used while developing a class
// Say we want to ensure any class we create for user/something else that is relevant should contain a name property and print method
// Then we can create one, or in this case, two interfaces
interface Identifiable {
  name: string;
}
interface Printable {
  print(): void;
}
// We can then use these interfaces in our class definition by using 'implements' keyword

// We obviously also have classes in TypeScript but in this case we need to define the properties as fields before using them in constructor or other places
// class User {
//   name: string;
//   private age: number;
//   // We can also set properties to private so that only inside the class can we access them and they can't be found on the object from outside

//   constructor(name: string, age: number) {
//     this.name = name;
//     this.age = age;
//   }
// }

// This is valid, but we can also do the same thing in a much shorter way because by using the classifiers like public/private
// We can declare the properties in the constructor itself
class User implements Identifiable, Printable{
  constructor(public name: string, private age: number) {
  }
  // This gets two arguments, first a string and a number, then assigns first to the name property, second to the age property

  print() {
    console.log(this.name);
  }
}
// By using implements, we can force a certain pattern and make rules in the team accordingly

// And we can also inherit from this just like normal JS
class Premium extends User {
  constructor(name:string, age: number, public subscription: string) {
    super(name, age);
  }
  // While creating it like this, we don't need to add the access identifiers for the inherited properties
}

// Along with classes, TypeScript introduces a new feature called interfaces for when we might want blueprint but not instantiable
// Like when we have a structure we want to adhere to for a class/object, then we can create an interface and use that
// In fact we can make use of the interface in resultArray's type which is an object's array
interface Result {
  res: number,
  print(): void
}

// Generic Types:
// We can also use generic types for data types that work with other data types
// One such example is the Array type, normally we can use Array<any> but we can also use any other type to dictate the type of items
// Promise also uses generic type since we're returning a function that might be anything

// const resultArray: { res: number, print: () => void }[] = [];
// This can be written by making use of the interface above
// const resultArray: Result[] = [];
// By using [] after the object type definiton, we can indicate that it is an array containing that type of object
// This is again a syntactic sugar for using generic type
const resultArray:Array<Result> = []

// We can also dictate the type of data our array needs to contain this way, and type inference can also do it for us if an element is given
const names = ['Gabriel']; // Will be inferred string type array

// We can also use literal types and union of types in order to allow specific literal values, like if we want one of some options
// For that we can use the pipe symbol to separate out the different options
type PrintType = 'console' | 'alert';
// We can also use union for the normal types, so we can use them in a new print function
// But we can also instead use something other than the type when we might not want to deal with literals
// The enum type, like type, is present on TS but not JS, and it is defined inside curly braces without assignment
enum OutputType { CONSOLE, ALERT };
// This way we can define two possible values, which can be accesed wtih dot notation

function printOne(item: string | number, method: OutputType) {
  // if (method === 'console') {
  //   console.log(item);
  // } else if (method === 'alert') {
  //   alert(item);
  // }
  // This helps us with autocompletion as well as gives us error if we try to pass in some other value
  
  // With the enum type, we can use it like this:
  if (method === OutputType.CONSOLE) {
    console.log(item);
  } else if (method === OutputType.ALERT) {
    alert(item);
  }
}

// Now we can add an event listener
submitBtn.addEventListener('click', () => {
  // Note: one thing the course doesn't cover is that during initialization, these values may also be null if not found
  // So for such cases we need to use ? at the end to indicate that we only use them if they are available as the primary type

  const num1 = +num1El?.value;
  // These are strings because the value in a input tag is always a string, regardless of the type
  // So we also need to convert them into numbers by simply using typecasting with +
  const num2 = +num2El?.value;
  // We can see that the value property shows an error, even though it compiles with errors into a .js file that works
  // But it produces the same bug of concatenation. Since using a getElementById we can get any type of html element,
  // its return type is HTMLElement, but the value property only exists for HTMLInputElement
  // We can't simply use :HTMLInputElement because the return value may be anything, so we ned to instead use type casting

  const result = add(num1, num2);

  // Instead of printing result number, we may also print an object
  // But defining a long object type is a hassle so we can instead use type aliases so that we can use the alias instead
  // For it it create a type which should start with a capital letter
  type ResultType = { res: number, print: () => void };
  // Then we can use it as the type
  const resultContainer: ResultType = {
    res: result,
    print() {
      printThing(this.res);
    }
  }
  // In this way we can define an object whose keys and value types we can define, though they can be inferred as well

  // Now let's also create an array outside where we can store this result object each time
  resultArray.push(resultContainer);

  // printThing(result);
  // resultContainer.print();
  // printThing(resultArray);

  printOne(result, OutputType.CONSOLE);
  printOne(result, OutputType.ALERT);
})
// I think I'll stop this here for now and continue tomorrow for the last part hopefully

// We can create a generic function as well
function logAndReturn<T>(value: T) {
  // By using any user defined type, T is just a convention, we can make sure we're working with the right type of data
  // In this case, the function defines a generic type T, which the value parameter must match
  console.log(value);
  return value;
}

// Since we've defined a generic function, we should play by the rules we have established there, for a generic type, we must specify ours
const something = logAndReturn<string>('Lunes Martes Miercoles Jueves Viernes Sabado Domingo');
// Here the specified type and the type of the parameter are the same, so since they are both strings I can use string operations here
// Else I wouldn't be able to use methods like spilit, etc

// We may have changes in our file which we need to recompile, but we can instead use -w flag in the compilation command to do so automatically
// Simiilarly, we can use 'tsc --init' to generate a tsconfig.json file where we can turn on/off different TypeScript features, like strict mode