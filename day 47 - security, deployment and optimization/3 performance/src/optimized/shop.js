// In this file we can first handle the addProduct in house where we then import from the product management file

import { initProducts } from './product-management';
// We need to import the products and the renderProducts function in order to migrate initProducts here
import { products } from './products.js';
import { renderProducts } from './rendering.js';

function addProduct(event) {
    import('./product-management.js').then((mod) => {
        mod.addProduct(event);
    });
    // We only import when needed
}

function deleteProduct(productId) {
    // Since the declaration in product-management requires a parameter for the product ID, we can take it here and pass it as well
    // But since renderProducts function will call deleteProduct it will call it with a parameter which we can accept here in this function
    import('./product-management.js').then((mod) => {
        mod.deleteProduct(productId);
    });
}

const addProductForm = document.getElementById('new-product');

// initProducts();
function initProducts() {
    renderProducts(products, deleteProduct);
    // But here a reference to the deleteProduct which was defined in product-management is needed, so we need another function
    // This function imports deleteProducts from product management
}
initProducts();

addProductForm.addEventListener('submit', addProduct);

// In fact I'm feeling a bit sleepy already so I'll continue this tomorrow morning, after pushing it tonight, with fresh mind and energy
