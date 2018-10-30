import path from 'path';
import test from 'ava';
import {transform} from '@babel/core';
import plugin from '.';

const parentDirFile = path.resolve(__dirname, '..', 'file.js');
const subDir = path.resolve(__dirname, 'testing');
const subDirFile = path.resolve(subDir, 'file.js');

function babelTest(t, {filename, source, result, mappings, cwd, expectError}) {
	const opts = {
		filename: filename || path.join(__dirname, 'file.js'),
		plugins: [
			[plugin, {mappings, cwd}]
		],
		compact: true
	};

	if (expectError) {
		t.throws(() => transform(source, opts), expectError);
		return;
	}

	const {code} = transform(source, opts);

	t.is(code, result);
}

test('exports', t => {
	t.is(typeof plugin, 'function');
	t.is(typeof plugin(), 'object');
});

test('in cwd', babelTest, {
	source: 'console.log(import.meta.url);',
	result: 'const importMeta={url:new URL(\'/file.js\',import.meta.url).toString()};console.log(importMeta.url);',
	mappings: {
		[path.resolve(__dirname, 'fake-dir')]: '/testing'
	}
});

test('in custom cwd', babelTest, {
	filename: 'html/file.js',
	source: 'console.log(import.meta.url);',
	result: 'const importMeta={url:new URL(\'/file.js\',import.meta.url).toString()};console.log(importMeta.url);',
	cwd: 'html',
	mappings: {
		[path.resolve(__dirname, 'fake-dir')]: '/testing'
	}
});

test('in mapped path', babelTest, {
	filename: subDirFile,
	source: 'console.log(import.meta.url);',
	result: 'const importMeta={url:new URL(\'/testing/file.js\',import.meta.url).toString()};console.log(importMeta.url);',
	mappings: {
		[__dirname]: '/wrong',
		[subDir]: '/testing'
	}
});

test('in relative mapped path', babelTest, {
	filename: subDirFile,
	source: 'console.log(import.meta.url);',
	result: 'const importMeta={url:new URL(\'/testing/file.js\',import.meta.url).toString()};console.log(importMeta.url);',
	mappings: {
		[__dirname]: '/wrong',
		testing: '/testing'
	}
});

test('in parent dir', babelTest, {
	filename: parentDirFile,
	source: 'console.log(import.meta.url);',
	expectError: {
		instanceOf: Error,
		message: `${parentDirFile} does not match any mappings or cwd.`
	}
});

test('already has importMeta', babelTest, {
	source: 'const importMeta=true;console.log(importMeta,import.meta.url);',
	result: 'const _importMeta={url:new URL(\'/file.js\',import.meta.url).toString()};const importMeta=true;console.log(importMeta,_importMeta.url);'
});

test('without import.meta', babelTest, {
	source: 'console.log(not.really.import.meta.url);',
	result: 'console.log(not.really.import.meta.url);'
});
