const { fetchData } = require('./http');

const loadTitle = () => {
    return fetchData().then((extractedData) => {
        const title = extractedData.title;
        const transformedTitle = title.toUpperCase();
        return transformedTitle;
    });
};

const printTitle = () => {
    loadTitle().then((title) => {
        console.log(title);
        // Even if we return the title here, it would only return from the inner function and the outer function cannot be used with expect
        return title;
    });
};

// In order to test this we need to create a new util.test.js file
exports.printTitle = printTitle;
exports.loadTitle = loadTitle;
// We need to use this way of exporting because that is what Jest supports, not the module exports, at least when the course was made...
