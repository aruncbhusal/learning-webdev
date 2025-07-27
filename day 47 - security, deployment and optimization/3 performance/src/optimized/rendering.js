// Since we need to create an element both while we're rendering for the first time, and we're adding something new, we can create a new function
function createProduct(product, productId, deleteProductFn) {
    // We can copy the creating logic to this one and return the new element at the end
    const newListEl = document.createElement('li');
    // const prodTitleEl = document.createElement('h2');
    // const prodPriceEl = document.createElement('p');
    // Creating elements might be intensive so we can use this instead
    newListEl.innerHTML = `
  <h2>${product.title}</h2>
  <p>${product.price}</p>
  `;
    // But this needs to be sanitized since scripts can be injected to title or price
    // But here we're more focused on performance
    const prodDeleteButtonEl = document.createElement('button');

    // prodTitleEl.innerHTML = product.title;
    // prodPriceEl.innerHTML = product.price;
    // prodDeleteButtonEl.innerHTML = 'DELETE';
    // Let's sanitize this by changing to textContent
    prodDeleteButtonEl.textContent = 'DELETE';

    newListEl.id = productId;

    prodDeleteButtonEl.addEventListener(
        'click',
        deleteProductFn.bind(null, productId)
    );

    // newListEl.appendChild(prodTitleEl);
    // newListEl.appendChild(prodPriceEl);
    newListEl.appendChild(prodDeleteButtonEl);

    return newListEl;
}

export function renderProducts(products, deleteProductFn) {
    const productListEl = document.getElementById('product-list');
    productListEl.innerHTML = '';

    // There are different methods to loop on an iterable, and we're using forEach here. We can use benchmark platforms like jsperf.com
    // To check for which approach is better, or we can run multiple trials here by using performance.now()
    // const startTime = performance.now();
    products.forEach((product) => {
        const newListEl = createProduct(product, product.id, deleteProductFn);
        productListEl.appendChild(newListEl);
    });
    // We can see that the time it takes for this is variable, and we don't have a clear estimate, also it can vary per device/engine version
    // We can also test the normal for loop here to do the same thing:
    // for (let i = 0; i < products.length; i++) {
    //     const newListEl = createProduct(
    //         products[i],
    //         products[i].id,
    //         deleteProductFn
    //     );
    //     productListEl.appendChild(newListEl);
    // }
    // We can see that the performance difference is minimal, and this can be verified by comparing in jsperf.app
    // So here we can pick any method, we can stick with the shorter and easier to read forEach method since it doesn't have a huge perf hit
    // const endTime = performance.now();
    // console.log(endTime - startTime);
}

// We can take a snapshot when we make the delete action, and we can turn on painted actions from the accessibility tab in secondary tabbar
// Then every time we delete, we can see that the entire unordered list and all items inside are flashed green, which shows everything is rerendered
// It makes sense to re-render when we're adding something (i.e. to the first so that everything is shifted back), but not while deleting
// More so, deleting the last item as well triggers this. It is because the renderProducts function above sets innerHtml for ul to ''
// This resets everything and we're adding all list items manually and adding everything inside the listitem as well as the list item afterwards
// We need to render it all when we're creating the ul for the first time, but for adding/deleting, we should instead simply update

export function updateProducts(product, productId, deleteFunction, isAdding) {
    // We use the last argument to dictate whether we want to add or delete
    if (isAdding) {
        // We can call the createProduct funciton here
        createProduct(product, productId, deleteFunction);
    } else {
        // if not adding, then it means we need to delete, let's first select the product to delete
        const prodEl = document.getElementById(productId);
        prodEl.remove();
        // We can also use prod.parentElement.removeChild(prod);
    }
    // Now that the function is made we need to update the add and delete functions as well
}

// In order to check for memory leaks we can take heap snapshots before and after an action like delete and compare the snapshots sizes
// We can look for things we expect to happen, like an element being deleted. In our case, we have removed the item, but it may not be
// garbage collected yet, and still be shown. We can look for li elements by just searching then hovering over its components
// If the components, like the button elements are highlighted in the DOM, it means the list element itself is present in the DOM
// We can learn about memory tab here: https://developer.chrome.com/docs/devtools/memory-problems

// We might have a memory leak in a case where we add the li element node to an array with push, but don't remove it from there at delete
// In that case, the reference to the node is held by the array and thus the detached li element doesn't get garbage collected
// We should always make sure to remove unused references, and minimize using these references as much as possible
