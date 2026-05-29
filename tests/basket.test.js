const assert = require('node:assert/strict');
const fs = require('node:fs');
const test = require('node:test');
const ts = require('typescript');

require.extensions['.ts'] = (module, filename) => {
  const source = fs.readFileSync(filename, 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      esModuleInterop: true,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
    fileName: filename,
  });

  module._compile(outputText, filename);
};

const {
  CHECKOUT_MINIMUM,
  FREE_DELIVERY_MINIMUM,
  addLineItem,
  canCheckout,
  formatCurrency,
  getBasketCount,
  getBasketLines,
  getBasketTotal,
  hasFreeDelivery,
  removeLineItem,
  setLineItemQuantity,
} = require('../helpers/basket.ts');

const apples = {
  name: 'Apples',
  price: 2.5,
  quantity_available: 2,
};

const bread = {
  name: 'Bread',
  price: 3.25,
  quantity_available: 5,
};

test('addLineItem creates and increments basket lines up to available stock', () => {
  const firstBasket = addLineItem({}, apples);
  const secondBasket = addLineItem(firstBasket, apples);
  const cappedBasket = addLineItem(secondBasket, apples);

  assert.equal(firstBasket.Apples.quantity, 1);
  assert.equal(secondBasket.Apples.quantity, 2);
  assert.equal(cappedBasket.Apples.quantity, 2);
});

test('addLineItem ignores products with no available stock', () => {
  const soldOutProduct = {
    name: 'Sold out product',
    price: 10,
    quantity_available: 0,
  };

  assert.deepEqual(addLineItem({}, soldOutProduct), {});
});

test('removeLineItem decrements a line and removes it when quantity reaches zero', () => {
  const basket = {
    Apples: {
      product: apples,
      quantity: 2,
    },
  };

  const decrementedBasket = removeLineItem(basket, 'Apples');
  const emptyBasket = removeLineItem(decrementedBasket, 'Apples');

  assert.equal(decrementedBasket.Apples.quantity, 1);
  assert.deepEqual(emptyBasket, {});
});

test('setLineItemQuantity clamps quantity to available stock and removes zero quantity lines', () => {
  const basket = {
    Apples: {
      product: apples,
      quantity: 1,
    },
  };

  const cappedBasket = setLineItemQuantity(basket, 'Apples', 10);
  const emptyBasket = setLineItemQuantity(cappedBasket, 'Apples', 0);

  assert.equal(cappedBasket.Apples.quantity, 2);
  assert.deepEqual(emptyBasket, {});
});

test('basket totals, counts, and line totals are calculated correctly', () => {
  const basket = {
    Apples: {
      product: apples,
      quantity: 2,
    },
    Bread: {
      product: bread,
      quantity: 1,
    },
  };

  assert.deepEqual(getBasketLines(basket), [
    {
      id: 'Apples',
      product: apples,
      quantity: 2,
      lineTotal: 5,
    },
    {
      id: 'Bread',
      product: bread,
      quantity: 1,
      lineTotal: 3.25,
    },
  ]);
  assert.equal(getBasketCount(basket), 3);
  assert.equal(getBasketTotal(basket), 8.25);
});

test('formatCurrency and basket thresholds use configured minimums', () => {
  assert.equal(formatCurrency(8.25), 'R8.25');
  assert.equal(formatCurrency(undefined), 'R0.00');

  assert.equal(canCheckout(CHECKOUT_MINIMUM - 0.01), false);
  assert.equal(canCheckout(CHECKOUT_MINIMUM), true);

  assert.equal(hasFreeDelivery(FREE_DELIVERY_MINIMUM - 0.01), false);
  assert.equal(hasFreeDelivery(FREE_DELIVERY_MINIMUM), true);
});
