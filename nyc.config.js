'use strict';

module.exports = require('@cfware/nyc')
	.fullCoverage()
	.exclude('rollup-demo/**');
