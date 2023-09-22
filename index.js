const fs = require('fs');
const path = require('path');

const imports = { /* imports go here */ };
const compiled = new WebAssembly.Module(
  fs.readFileSync(path.join(__dirname, '/build/optimized.wasm'))
);

Object.defineProperty(module, 'exports', {
  get: () => new WebAssembly.Instance(compiled, imports).exports,
});
