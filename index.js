'use strict';

const path = require('path');
const template = require('@babel/template').default;
const inherits = require('@babel/plugin-syntax-import-meta').default;

const importStyles = {
	amd: "new URL((typeof process !== 'undefined' && process.versions && process.versions.node ? 'file:' : '') + module.uri).href",
	cjs: "new (typeof URL !== 'undefined' ? URL : require('ur'+'l').URL)((process.browser ? '' : 'file:') + __filename, process.browser && document.baseURI).href",
	esm: 'import.meta.url',
	iife: "typeof document !== 'undefined' ? document.currentScript && document.currentScript.src || document.baseURI : new (typeof URL !== 'undefined' ? URL : require('ur'+'l').URL)('file:' + __filename).href",
	umd: "typeof document !== 'undefined' ? document.currentScript && document.currentScript.src || document.baseURI : new (typeof URL !== 'undefined' ? URL : require('ur'+'l').URL)('file:' + __filename).href",
	system: 'module.meta.url'
};

module.exports = () => ({
	inherits,
	visitor: {
		Program(progPath, {opts}) {
			const metas = [];
			const identifiers = new Set();
			const {sourceFileName} = progPath.hub.file.opts.parserOpts;

			progPath.traverse({
				MetaProperty(path) {
					const {node, scope} = path;

					/* istanbul ignore else */
					if (node.meta && node.meta.name === 'import' && node.property.name === 'meta') {
						metas.push(path);
					}

					for (const name of Object.keys(scope.getAllBindings())) {
						identifiers.add(name);
					}
				}
			});

			if (metas.length === 0) {
				return;
			}

			let metaId = 'importMeta';
			while (identifiers.has(metaId)) {
				metaId = progPath.scope.generateUidIdentifier('importMeta').name;
			}

			/* Check longest basePaths first. */
			const mappings = Object.entries(opts.mappings || {}).reduce((acc, [filePath, baseURL]) => {
				acc[path.resolve(filePath)] = baseURL;

				return acc;
			}, {});
			const basePaths = Object.keys(mappings).sort((a, b) => b.length - a.length);
			let relativeURL;
			for (const basePath of basePaths) {
				if (sourceFileName.startsWith(basePath)) {
					relativeURL = sourceFileName.replace(basePath, mappings[basePath]);
					break;
				}
			}

			if (typeof relativeURL === 'undefined') {
				const cwd = opts.cwd ? path.resolve(opts.cwd) : process.cwd();

				if (!sourceFileName.startsWith(cwd)) {
					throw new Error(`${sourceFileName} does not match any mappings or cwd.`);
				}

				relativeURL = sourceFileName.replace(cwd, '');
			}

			progPath.node.body.unshift(template.ast(`const ${metaId} = {
				url: new URL('${relativeURL}', ${importStyles[opts.importStyle] || importStyles.esm}).href
			};`, {plugins: ['importMeta']}));

			for (const meta of metas) {
				meta.replaceWith(template.ast`${metaId}`);
			}
		}
	}
});
