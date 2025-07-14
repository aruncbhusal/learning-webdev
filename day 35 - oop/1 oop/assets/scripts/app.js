/* Object Oriented Programming (OOP) is a way of programming where we work with objects (real world entities)
It is not impossible to write a program using just functions but when we have objects, we can divide the app into components
Let's create this app using the object properties and methods we already know */

/*
const productList = {
    products: [
        {
            title: 'Motorbike',
            imgUrl: 'https://images.unsplash.com/photo-1750365434652-ada8eeab6c8c?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            price: '15,999',
            description: 'This red bike is one of a kind.',
        },
        {
            title: 'Ergonomic Chair',
            imgUrl: 'https://images.unsplash.com/photo-1750306957077-b74e45fe1819?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            price: '450',
            description:
                'Save yourself from headache and back pain with this chair.',
        },
    ],
    render() {
        // We can now add the render logic here
        const renderHook = document.getElementById('app');
        // We can create a list inside this element and add items into the list this way
        const fullList = document.createElement('ul');
        fullList.className = 'product-list';
        // Next we can loop through each of the products in the product list
        renderHook.append(fullList);
        for (const item of this.products) {
            const listEl = document.createElement('li');
            listEl.classList.add('product-item');
            // Let's now also add the content to this list
            listEl.innerHTML = `
            <div>
                <img src="${item.imgUrl}" alt="${item.title}" />
                <div class="product-item__content">
                    <h2>${item.title}</h2>
                    <h3>\$${item.price}</h3>
                    <p>${item.description}</p>
                    <button>Add to cart</button>
                </div>
            </div>
            `;

            // Let's append this item to the ul
            fullList.append(listEl);
        }
    },
};
*/
// Now we can call the render method to show the items
// productList.render();

// But this object doesn't show any advantages, we could have just as well done it with functions
// We have no way to reuse this object or the object inside. But object oriented programming has classes, which let us do just that

// For example each product in the products array is almost the same apart from values i.e. share the same properties
// Classes are the generic definitions for an object, or the blueprint for an object. Objects are instances of a class
// We can define a class as:

class Product {
    // We use uppercase variable names when naming a class
    // A class has several fields, which translate into properties inside an object
    // title = 'DEFAULT';
    // We define the fields with = instead of : and end the line with a semicolon instead of a comma like in objects
    // imgUrl;
    // price;
    // description;
    // These fields will be undefined at the start

    // We can have functions inside the class as well, by just using functionName() {}
    // There is a reserved function called constructor which takes arguments while the object is being constructed using 'new'
    constructor(title, image, price, desc) {
        this.title = title;
        this.imgUrl = image;
        this.price = price;
        this.description = desc;
        // In this way we can assign the new object's properties by taking values during creation

        // We can even remove the field definition when we already initialize them inside the constructor function
        // We can create new fields for the function i.e. properties for the object inside the function
    }
}

// We can create a new object using this class with the new keyword:
// const someProduct  = new Product()
// But we also want the product to have these properties, which we haven't set yet. Instead of setting it afterwards
// We can also set it while initializing the new object

// Now let's create the base class from which we will inherit in the other classes
class ElementAttribute {
    constructor(name, value) {
        this.name = name;
        this.value = value;
    }
}
class Component {
    constructor(renderHookId, toRender = true) {
        // The ID of the item to which we need to append (i.e. the parent element) will be passed as the renderHookId
        this.renderHookId = renderHookId;

        if (toRender) {
            this.render();
        }
        // It might look like we're calling render method out of nowhere here, so we can add an empty render function below
        // Even though render is called here, but the 'this' refers to the class whose object is being created
        // We're not creating an object with Component class so this render function never gets executed
        // The classes that extend the Component class have their own render() methods, so they 'override' this one
    }

    render() {}

    createRootElement(element, classes, attributes) {
        // This class is responsible for creating an element, the type of element, any className and attributes should be passed
        // Now let's create the element to be appended
        const rootElement = document.createElement(element);
        // If there was a class parameter send, we need to add it to the element
        if (classes) {
            rootElement.className = classes;
        }
        // And if any attributes were sent, we should loop through the array of attributes
        if (attributes && attributes.length > 0) {
            for (const attr of attributes) {
                rootElement.setAttribute(attr.name, attr.value);
                // And since we're expecting an object of attributes, and it is reusable, we can create a new class for it
            }
        }

        // Finally we need to append the root element to the render hook then return the root element
        document.getElementById(this.renderHookId).append(rootElement);
        return rootElement;
    }
}

// We can separate the rendering logic for a single product into a new class so that it can render each item and work with it
class ProductItem extends Component {
    constructor(product, renderHookId) {
        super(renderHookId, false);
        // We can simply define new fields here easily
        // Since we're taking a product object as the parameter to this constructor, we can use
        this.product = product;
        this.renderHookId = renderHookId;

        // We have a similar problem here, because product is being defined AFTER super() is called
        // We can't bring super after this line because 'this' can't be used until super() is called
        // Another way to remedy this is to also pass a flag to the constructor and render only if the flag is true
        // Then we can call the render function on our own terms here
        this.render();
    }

    // For the cart function
    addToCart() {
        // console.log(this.product);
        // We can add the product from here using the static function we have defined in the App class
        App.addToShoppingCart(this.product);
    }

    // Similarly, we can take the render logic for a single product and place it here
    render() {
        // const listEl = document.createElement('li');
        // listEl.classList.add('product-item');

        const listEl = this.createRootElement('li', 'product-item');

        // We need to change the 'item' variable here since we're working with a single productItem object
        listEl.innerHTML = `
            <div>
            <img src="${this.product.imgUrl}" alt="${this.product.title}" />
            <div class="product-item__content">
            <h2>${this.product.title}</h2>
            <h3>\$${this.product.price}</h3>
            <p>${this.product.description}</p>
            <button>Add to cart</button>
            </div>
            </div>
            `;

        // We have a button to add to cart, but we haven't used it yet. We need to make it useful
        // Let's create a new addToCart function inside this class which acts as the event handler for this button click
        // In order to select the button for THIS PRODUCT, we can simply select the listEl here and since each object
        // has its own listEl, we can select only its button by using it
        const cartBtn = listEl.querySelector('button');
        cartBtn.addEventListener('click', this.addToCart.bind(this));
        // Since this function is called by the browser/window, if we don't bind it to this object, we can't refer to it in the fn

        // Now we can either append the list item here by taking the parent node as a parameter
        // Or we can keep the appending logic in the main function by returning this newly created element
        // return listEl;
        // Appending logic in creation already
    }
}

// To work with the shopping list, we can create a new class
class ShoppingCart extends Component {
    // To inherit from a base class we use the extends keyword. In JS a class can only inherit from one base class
    items = [];

    set cartItems(list) {
        // This takes an array as an argument and sets the items array to this array
        this.items = list;
        // Then it updates the button
        this.totalSum.textContent = `Total: $${this.totalAmount.toFixed(2)}`;
        // We add toFixed to avoid weird floating point artifacts
    }

    get totalAmount() {
        const sum = this.items.reduce((prev, curr) => prev + curr.price, 0);
        return sum;
        // This gives us the total amount of all the items in the cart
    }

    // So far we don't have  away to add items to the cart, since we need to communicate between classes
    addProduct(product) {
        // this.items.push(product);
        // But how do we call this function from the ProductItem class where the click is handled

        // Now that we have received the product, we can update the price using the property we have here
        // this.price.textContent = this.items.reduce(
        //     (prev, curr) => prev + curr.price,
        //     0
        // );
        // We can take these logic and create getters setters to manipulate the values here

        // Since this function is called when we need to add the product
        // We can pass the updated array to the setter
        const updatedArray = [...this.items];
        updatedArray.push(product);
        this.cartItems = updatedArray;
        // We could probably also do this.cartItems = [...this.items, product];
    }

    render() {
        // We can create a new section here and add the info there
        // const cartSection = document.createElement('section');
        // cartSection.className = 'cart';
        // We can instead call the createRootElement method that we have inherited from the base class
        const cartSection = this.createRootElement('section', 'cart');

        cartSection.innerHTML = `
        <h2>Total: \$${0}</h2>
        <button>Order Now!</button>
        `;
        // We need a way to access the total price, so let's create a field for that
        this.totalSum = cartSection.querySelector('h2');

        // We also have the order button here so let's add some clickability
        // For that we need a new function
        // cartSection.querySelector('button').addEventListener('click', () => this.createOrder());
        // This is an alternative to the .bind() solution of passing 'this' as this current object
        // In this method, we pass a reference to an anonymous function which when called will call the createOrder method
        // Since the anonymous function doesn't care about 'this', the 'this' will refer to the object that is created

        // But there is one other way to make sure this refers to the current object while retaining old syntax
        cartSection
            .querySelector('button')
            .addEventListener('click', this.createOrder);
        // But the createOrder is an arrow function stored as a field.
        // That way when the function is executed, this refers to the object that was created

        // Finally we return this element to where we use it
        // return cartSection;
        // Since we have already appended it in the createRootElement method, we don't need this return
    }

    // This class doesn't have a constructor yet so it directly calls the base class constructor, which isn't available
    // So we need to first create a constructor here so that we can call the constructor of base class using super()
    constructor(renderHookId) {
        super(renderHookId, false);
        // But we need to pass the id of the hook, so we can pass it when we construct this class
        this.createOrder = () => {
            // We need to specify it as a property instead of a field because the function is referenced in render()
            // But the render() is called by base class constructor. So we need to run it inside this constructor
            // And we also need it to be defined here since this.items is not defined until super() finishes
            console.log(this.items);
        };
        this.render();
    }
}

// Now we can replace the object literals with a new object creation using a class and constructor
// Finally we convert the entire object literal into a class to be initialized later
class ProductList extends Component {
    // Similar to other classes, we need to make this extend the base Component class as well
    // But this one should be done before product item since an item can only be appended once the list itself is appended

    // We can make a field private by using the # symbol before the field name, and use it later while using it as well
    // We can do this so that anyone from outside the class cannot access this field and shouldn't either
    #products = [];
    // We can also signal something is private by using _ in front of the name, called pseudo private properties
    // It is simply a convention, and it doesn't prevent them from being accessed from outside, unlike truly private properties

    constructor(renderHookId) {
        super(renderHookId, false);
        // To use anything in the super class (base class), we must first use super()

        // But now we have a problem, our products array is only automatically defined after the super class is called
        // This means the render() call inside the constructor in base call will fail because products is not yet defined
        // To solve this, one approach is to modify render function for this method so that it only renders if products are available
        // We can separate the actual rendering part to another function which is called by render()

        // To fetch and render, we need to call render first because we have another renderProducts inside fetchProducts
        this.render();
        this.#fetchProducts();
    }
    // Even if we have an empty constructor, the product field is automatically added to the object created from this class

    // Let's also separate the logic for assigning values to the array
    // We can make the method private as well
    #fetchProducts() {
        this.#products = [
            new Product(
                'Motorbike',
                'https://images.unsplash.com/photo-1750365434652-ada8eeab6c8c?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                15999,
                'This red bike is one of a kind.'
            ),
            new Product(
                'Ergonomic Chair',
                'https://images.unsplash.com/photo-1750306957077-b74e45fe1819?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                450,
                'Save yourself from headache and back pain with this chair.'
            ),
        ];
        this.renderProducts();
    }

    renderProducts() {
        // I can copy the product rendering part from render() to here, then call this function there if there are products
        // We also need to call this inside the constructor or this class since initial call by super class woudn't trigger this

        // Next we can loop through each of the products in the product list
        for (const item of this.#products) {
            // We need to first create an item of the productitem class
            // const productItem = new ProductItem(item, 'prod-list');
            new ProductItem(item, 'prod-list');
            // Since we're not rendering here, just creating this objcet is enough, we don't need to store it

            // We need to also pass the id since its constructor needs to also call the constructor of the base class
            // const listEl = productItem.render();
            // productItem.render();
            // Let's append this item to the ul
            // fullList.append(listEl);
            // Appending is already done
        }
    }

    render() {
        // We can now add the render logic here
        // We can create a list inside this element and add items into the list this way
        // const fullList = document.createElement('ul');
        // fullList.className = 'product-list';

        this.createRootElement('ul', 'product-list', [
            new ElementAttribute('id', 'prod-list'),
        ]);
        // Since we need the id to access the hook, we must first add an id to the list element
        // Then only we can pass it as the hook for the constructor of the product item class

        if (this.#products && this.#products.length > 0) {
            this.renderProducts;
        }

        // We now return this full list to the main class
        // return fullList;
        // Appending is already done so returning is not needed
    }
}

// Since we've converted the full logic into classes, we need to initialize. We can only initialize after the definitions
// const productList = new ProductList();
// productList.render();

// In order to combine both the product list and shopping cart classes, we can have a new separate class
class Shop {
    render() {
        // We will render both here, so we need to get the hook here and return the elements here so that we can render
        // const renderHook = document.getElementById('app');
        // const shoppingCart = new ShoppingCart();
        // Instead of creating a variable for this class, we can create a field which can be used from outside as well
        this.shoppingCart = new ShoppingCart('app');
        // const cartElement = this.shoppingCart.render();
        // The render method doesn't return anything anymore

        // Rendering after creating each time is redundant, so we can eliminate by rendering inside the constructor itself
        // But calling on each constructor is still redundant, so we can instead call render on the base class constructor
        // this.shoppingCart.render();

        new ProductList('app');
        // const productsElement = productList.render();
        // productList.render();

        // renderHook.append(cartElement);
        // renderHook.append(productsElement);
    }
}

// const shop = new Shop();
// shop.render();

// A static property, defined with the static keyword, can be used on the class itself without being instantiated
// Let's create a new App class which works with static property
class App {
    static cart;

    static init() {
        const shop = new Shop();
        // We can now access the shoppingCart property of this shop object
        shop.render();
        // The cart property is only defined inside render method, so we need to do it after this
        this.cart = shop.shoppingCart;
    }

    // Similarly, we can have another static method that handles the adding to shopping cart, which can be called from above
    static addToShoppingCart(product) {
        // Finally, we can call the addProduct function here when we need to add a product to the cart
        this.cart.addProduct(product);
    }
}

// Since we're using a static function inside the App class, we can directly call it as:
App.init();

// Just because we can use classes doesn't mean object literals shouldn't be used. They are very useful for grouping related items
// When we only create a single object, object literals are more efficient, but when we need multiple instances, classes allow easy duplication

// In this project, we have a lot of duplication in terms of the render function
// Each render function basically creates a new element then returns it, even if the other logic in the middle is different
// We can use inheritance to make it streamlined where there is a base class with common features and other classes extend it

// When we create an object from a class, and display it, it shows as if the class is a type, when it is not
// it is actually an instance of the class, so we can use the instanceof keyword that returns true or false
// If we create a new class called person and create a new object based on it, we can check
class Person {
    name = 'Gina';
}
const person = new Person();

console.log(person instanceof Person); // This should yield true

// Similarly, if we select a button from the page
const btn = document.querySelector('button');
// It is an instance of the HTMLButtonElement class
console.log(btn instanceof HTMLButtonElement); // Also true
// And since HTMLButtonElement extends the HTMLElement class, button is also an instance of that
console.log(btn instanceof HTMLElement); // Also true
// But btn is not an instance of the class Person
console.log(btn instanceof Person); // should be false

// There are other built in classes as well, like the Object class and Array class and we can use
const newObject = new Object(); // functionally same as const newObject = {};
const newArray = new Array(); // functionally same as const newArray = [];
// But these methods being from a base class are usually slower than the literal instantiation, so not preferred

// Objects have descriptors. say we create a new object with two properties/methods
const personExperiment = {
    name: 'Yvonne',
    age: 25,
    speak() {
        console.log('hi');
    },
};
// Now if we use the method available in the Object class
console.log(Object.getOwnPropertyDescriptors(personExperiment));
// We can see that it shows the descriptors with values such as configurable, enumerable, value and writable
// All of them are true, value refers to the value held by each
// configurable means we can delete a property/method using the delete keyword
delete personExperiment.age;
console.log(personExperiment);
// enumerable means the property/method can appear in a for...in loop
for (key in personExperiment) {
    console.log(key);
}
// writable means we can change the value of the property/method
personExperiment.name = 'Tina';
console.log(personExperiment);

// But if we set writable to false by using defineProperty
Object.defineProperty(personExperiment, 'name', {
    configurable: true,
    enumerable: true,
    value: personExperiment.name,
    writable: false,
});
// We can't change the value, it doesn't throw any error when we try, but it can't be changed
personExperiment.name = 'Steven';
console.log(personExperiment);
// We can see that it retains its value

// SImilarly if we set configurable to false
Object.defineProperty(personExperiment, 'name', {
    configurable: false,
    enumerable: true,
    value: personExperiment.name,
    writable: true,
});
// We can't delete name property, but it doesn't throw any error either
delete personExperiment.name;

// Now what if we don't want a certain property/method to be able to be accessed using for...in, we can set it to false
Object.defineProperty(personExperiment, 'speak', {
    configurable: true,
    enumerable: false,
    value: personExperiment.speak,
    writable: true,
});
// It will not appear when we use for...in
for (key in personExperiment) {
    console.log(key);
}
