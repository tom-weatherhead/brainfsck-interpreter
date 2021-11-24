// rollup.config.js

/**
 * Copyright (c) Tom Weatherhead. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in
 * the LICENSE file in the root directory of this source tree.
 */

'use strict';

import { terser } from 'rollup-plugin-terser';

export default {
	input: './dist/lib/main.js',
	output: [
		{
			// Create a CommonJS version for Node.js
			file: 'dist/brainfsck-interpreter.cjs.js',
			format: 'cjs',
			exports: 'named'
		},
		{
			// Create an ESModule version
			file: 'dist/brainfsck-interpreter.esm.js',
			format: 'es',
			esModule: true,
			compact: true
		}
	],
	external: ['fs/promises', 'process'],
	context: 'this',
	plugins: [terser()]
};
