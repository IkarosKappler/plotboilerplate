import typescript from "rollup-plugin-typescript2";
import commonjs from "rollup-plugin-commonjs";
import external from "rollup-plugin-peer-deps-external";
import resolve from "rollup-plugin-node-resolve";
import {terser} from 'rollup-plugin-terser';

import pkg from "./package.json";

const moduleName = "plotboilerplate";

export default {
    //input: "src/es2015/module.js",
    // input: "src/js/module.js",
    // input: "src/esm/index.js", // working
    input: "src/esm/index.js", // module.js",
    output: [
	/* {
	    file: "dist/index.cjs.js", // pkg.main,
	    format: "cjs",
	    // exports: "named",
	    name: moduleName,
	    sourcemap: true
	    // plugins: [terser()]
	}, */
	{
	    file: "dist/index.esm.js", // pkg.module,
	    format: "es",
	    name: moduleName,
	    // exports: "named",
	    sourcemap: true
	}
    ],
    plugins: [
	external(),
	resolve(),
	typescript({
	    rollupCommonJSResolveHack: true,
	    exclude: "**/__tests__/**",
	    clean: true
	}),
	commonjs({
	    include: ["node_modules/**"]
	})
    ]
};
