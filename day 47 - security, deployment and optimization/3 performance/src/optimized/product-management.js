import { renderProducts } from './rendering';

//Similarly we can take the products array out of this file into another one and import here
// import { products as prod } from './products';
// const products = prod;
// I wonder why Max did this when we could simply
import { products } from './products';
// Now since we have the products in a separate file, we can avoid importing the entire product management module when I import products
// since a file has to be loaded and read for us to be able to import something from it
// Subsequently, we can remove the initProducts function from here because now I can access products without this file

export function deleteProduct(prodId) {
    const updatedProducts = [];
    for (const prod of products) {
        if (prod.id !== prodId) {
            updatedProducts.push(prod);
        }
    }
    products = updatedProducts;
    renderProducts(products, deleteProduct);
}

export function addProduct(event) {
    event.preventDefault();
    const titleEl = document.querySelector('#new-product #title');
    const priceEl = document.querySelector('#new-product #price');

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
    renderProducts(products, deleteProduct);
}
