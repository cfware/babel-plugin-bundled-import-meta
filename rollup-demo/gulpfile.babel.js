import gulp from 'gulp';
import pump from 'pump';
import rollup from 'vinyl-rollup';
import babel from 'rollup-plugin-babel';

function bundle() {
	return pump(
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
		gulp.dest('dist')
	);
}

function copy() {
	return pump(
		gulp.src(['src/**', '!src/**/*.js']),
		gulp.dest('dist')
	);
}

export default gulp.parallel(bundle, copy);
