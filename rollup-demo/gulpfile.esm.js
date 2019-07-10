import gulp from 'gulp';
import pipeline from 'stream.pipeline-shim';
import rollup from 'vinyl-rollup';
import babel from 'rollup-plugin-babel';

const printError = error => {
	if (error) {
		console.error(error);
	}
};

function bundle() {
	return pipeline(
		rollup({
			rollup: {
				input: 'src/main/main.js',
				plugins: [babel({
					babelrc: false,
					configFile: false,
					plugins: [
						['bundled-import-meta', {
							mappings: {
								/* src is at '..' relative to the bundle output file. */
								src: '..'
							}
						}]
					]
				})],
				output: [
					{
						format: 'esm',
						file: 'main/main.esm.js'
					},
					{
						format: 'iife',
						file: 'main/main.iife.js'
					},
					{
						format: 'system',
						file: 'main/main.system.js'
					}
				]
			}
		}),
		gulp.dest('dist'),
		printError
	);
}

function copy() {
	return pipeline(
		gulp.src(['src/**', '!src/**/*.js']),
		gulp.dest('dist'),
		printError
	);
}

export default gulp.parallel(bundle, copy);
