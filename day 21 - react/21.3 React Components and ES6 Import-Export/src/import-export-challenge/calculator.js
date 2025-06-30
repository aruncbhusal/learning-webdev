function add(n1, n2) {
  return n1 + n2;
}

function multiply(n1, n2) {
  return n1 * n2;
}

function subtract(n1, n2) {
  return n1 - n2;
}

function divide(n1, n2) {
  return n1 / n2;
}

/* We need to export all the functions in this file into the index.js, I will export add by default */

export default add;
export { multiply, subtract, divide };
