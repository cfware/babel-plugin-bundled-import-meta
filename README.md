# babel-plugin-bundled-import-meta

[![Travis CI][travis-image]][travis-url]
[![Greenkeeper badge][gk-image]](https://greenkeeper.io/)
[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![BSD-3-Clause][license-image]](LICENSE)

Babel plugin to rewrite import.meta.url for use in bundles.

## Install babel-plugin-bundled-import-meta

This module requires node.js 8 or above and `@babel/core`.

```sh
npm i babel-plugin-bundled-import-meta
```

## Usage

Add `bundled-import-meta` to `plugins` in your babel settings.

## Settings

```json
{
	"plugins": [
		["bundled-import-meta", {
			"mappings": {
				"node_modules": "/assets"
			},
			"cwd": "html"
		}]
	]
}
```

This example will assume that `html/` will be served at the root `/` URL with
`node_modules/` served from `/assets`.  Any use of `import.meta` outside these
two folders will throw an exception.

### cwd

If no mappings match it is assumed that `cwd` is mapped to the root `/` URL.
Default `process.cwd()`.

### mappings

This maps source paths to server URL's.  Key's represent local source paths, values
represent base URL which would be used for the unbundled build.  Default `{}`.

### importStyle

It's necessary to know the full URL of the bundle as loaded by the browser.  The best
way to determine this is different based on what type of bundle will be used.

Supported styles are: `amd`, `cjs`, `esm`, `iife`, `umd`, `system`.  Default `esm`.

The `esm` import style generates `import.meta.url` to detect the bundled URL.  This
is not compatible with webpack so use another method.  If anyone knows of a 'best'
option for use with webpack please open an issue or PR.

When bundling with rollup you should generally use `esm` here.  For any output format
other than `esm` rollup will translate to the correct output.  The only exception is
if rollup is generating an `esm` bundle for targets that do not support
`import.meta.url`.  If you are using `import.meta.url` in your code but must maintain
compatibility with browsers that do not support this it is probably best to have rollup
generate a different bundle format.

## Running tests

Tests are provided by xo and ava.

```sh
npm install
npm test
```

## Attribution

This module is based on code found in [polymer-build].

[npm-image]: https://img.shields.io/npm/v/babel-plugin-bundled-import-meta.svg
[npm-url]: https://npmjs.org/package/babel-plugin-bundled-import-meta
[travis-image]: https://travis-ci.org/cfware/babel-plugin-bundled-import-meta.svg?branch=master
[travis-url]: https://travis-ci.org/cfware/babel-plugin-bundled-import-meta
[gk-image]: https://badges.greenkeeper.io/cfware/babel-plugin-bundled-import-meta.svg
[downloads-image]: https://img.shields.io/npm/dm/babel-plugin-bundled-import-meta.svg
[downloads-url]: https://npmjs.org/package/babel-plugin-bundled-import-meta
[license-image]: https://img.shields.io/npm/l/babel-plugin-bundled-import-meta.svg
[polymer-build]: https://github.com/Polymer/tools/blob/fdc9e5472674c63435e8188fdc00b342184ce8f3/packages/build/src/babel-plugin-import-meta.ts
