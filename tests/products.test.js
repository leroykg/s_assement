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
      resolveJsonModule: true,
      target: ts.ScriptTarget.ES2020,
    },
    fileName: filename,
  });

  module._compile(outputText, filename);
};

const {
  getProductById,
  getProducts,
} = require('../helpers/products.ts');

test('getProducts includes sold-out products by default', () => {
  const products = getProducts();

  assert.ok(products.length > 0);
  assert.ok(products.some((product) => product.quantity_available <= 0));
});

test('getProducts can exclude sold-out products', () => {
  const products = getProducts({ onlyInStock: true });

  assert.ok(products.length > 0);
  assert.equal(products.some((product) => product.quantity_available <= 0), false);
});

test('getProducts searches by trimmed case-insensitive name', () => {
  const products = getProducts({ onlyInStock: false, search: '  beef  ' });

  assert.deepEqual(products.map((product) => product.name), ['Ground Beef']);
});

test('getProductById returns a matching product or undefined', () => {
  assert.equal(getProductById('Apples')?.name, 'Apples');
  assert.equal(getProductById('Missing product'), undefined);
  assert.equal(getProductById(null), undefined);
});
