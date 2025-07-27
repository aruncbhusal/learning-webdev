import { updateProducts } from './rendering';

//Similarly we can take the products array out of this file into another one and import here
// import { products as prod } from './products';
// const products = prod;
// I wonder why Max did this when we could simply
import { products } from './products';
// Now since we have the products in a separate file, we can avoid importing the entire product management module when I import products
// since a file has to be loaded and read for us to be able to import something from it
// Subsequently, we can remove the initProducts function from here because now I can access products without this file

// We had to use this let here so that we can mutate the products array, because "imported bindings are frozen by the JS engine"
// let products = prod; // Done when products is imported as prod
// After optimizing the deleteProduct function, this is not a necessity anymore

const titleEl = document.getElementById('title');
const priceEl = document.getElementById('price');

export function deleteProduct(prodId) {
    // We can also make micro optimizations here, since in this function we're creating a new array, pushing to it, etc, there's a better method
    // const updatedProducts = [];
    // let deletedProduct;
    // for (const prod of products) {
    //   if (prod.id !== prodId) {
    //     updatedProducts.push(prod);
    //   } else {
    //     // We add this condition so that we can capture the product to be deleted here
    //     deletedProduct = prod;
    //   }
    // }
    // products = updatedProducts;

    // We can instead just get the index of deleted product and delete it using splice, that way we're not mutating the products array either
    const deletedProdIdx = products.findIndex((prod) => prod.id === prodId);
    const deletedProduct = products[deletedProdIdx];
    products.splice(deletedProdIdx, 1);

    // renderProducts(products, deleteProduct);
    // Instead of calling render we need to call update so for that we need to get the product to be deleted
    updateProducts(deletedProduct, prodId, deleteProduct, false);
}

export function addProduct(event) {
    // event.preventDefault();
    // Since handle the event in the other file (shop), we need to add it right after else it will reload the page entirely
    // const titleEl = document.querySelector('#new-product #title');
    // const priceEl = document.querySelector('#new-product #price');
    // We can also make these definitions global for this module instead of having them being defined each time the function is run
    // And we can also change querySelector to getElementById which is faster

    const title = titleEl.value;
    const price = priceEl.value;

    if (title.trim().length === 0 || price.trim().length === 0 || +price < 0) {
        alert('Please enter some valid input values for title and price.');
        return;
    }

    const newProduct = {
        id: new Date().toString(),
        title: title,
        price: price,
    };

    products.unshift(newProduct);
    // In this line we unshift the items which means every item has to be moved before the new item can be placed
    // This is slower than push, but since this is the intended behavior, trying to micro optimize this may result in complex or worse, broken code
    // So we should be careful about what changes we make to our code

    // renderProducts(products, deleteProduct);
    // We need to call update here as well
    updateProducts(newProduct, newProduct.id, deleteProduct);
}
