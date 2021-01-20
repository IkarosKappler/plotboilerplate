# Compile & Build

## Minimize the package

The package is minimized with webpack. See the `./bin/webpack.config.js` file.

### Install webpack
This will install the `npm-webpack` package with the required dependencies
for you from the `package.json` file.
~~~bash
 $ npm install
~~~


### Run webpack
This will generate the `./dist/plotboilerplate.min.js` file for you
from the sources code files in `./src/js/*`.
~~~bash
 $ npm run webpack
~~~




## Compile Typescript

The package is compiled with npm typescript. See the `tsconfig.json` file.

### Run the typescript compiler
This is not yet finished; the old vanilla-JS files will soon be dropped and replaced
by generated files, compiled from Typescript.
~~~bash
 $ npm run compile-typescript
~~~
There is also a sandbox script, compiling and running the typescript files inside your browser. Please note that
due to performance reasons it is not recommended to use this in production. Always compile your typescript files
for this purpose.

