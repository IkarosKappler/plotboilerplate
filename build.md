# Compile & Build

## Minimize the package

The package is minimized with webpack. See the `./bin/webpack.config.js` file.

### Install webpack

This will install the `npm-webpack` package with the required dependencies
for you from the `package.json` file.

```bash
 $ npm install
```

### Compile Typescript (for browser)

This will generate the `./src/cjs/*` files for you
from the sources code files in `./src/ts/*`.

```bash
 $ npm run compile-typescript-browser
```

### Compile Typescript (for ESM module)

This will generate the `./src/esm/*.js` files for you
from the sources code files in `./src/ts/*`.

```bash
 $ npm run compile-typescript-module
```

### Run webpack (for browser)

This will generate the `./dist/plotboilerplate.min.js` file for you
from the sources code files in `./src/cjs/*`.

```bash
 $ npm run webpack-browser
```

### Run webpack

This will generate the `./dist/index.esm.js` file for you
from the sources code files in `./src/cjs/*`.

```bash
 $ npm run webpack-module
```

### Run webpack

This will generate the `./dist/plotboilerplate.min.js` file for you
from the sources code files in `./src/cjs/*`.

```bash
 $ npm run webpack-browser
```

### Build all (Browser and ESM module)

This will generate the `./dist/plotboilerplate.min.js` file for you
from the sources code files in `./src/cjs/*`.

```bash
 $ npm run build
```

## Compile Typescript

The package is compiled with npm typescript. See the `tsconfig.json` file.

### Run the typescript compiler

This is not yet finished; the old vanilla-JS files will soon be dropped and replaced
by generated files, compiled from Typescript.

```bash
 $ npm run compile-typescript
```

There is also a sandbox script, compiling and running the typescript files inside your browser. Please note that
due to performance reasons it is not recommended to use this in production. Always compile your typescript files
for this purpose.
