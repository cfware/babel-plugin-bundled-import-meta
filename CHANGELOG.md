# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

# [0.3.0](https://github.com/cfware/babel-plugin-bundled-import-meta/compare/v0.2.2...v0.3.0) (2019-03-02)


### Features

* Add baseURI importStyle. ([#4](https://github.com/cfware/babel-plugin-bundled-import-meta/issues/4)) ([bad102c](https://github.com/cfware/babel-plugin-bundled-import-meta/commit/bad102c)), closes [#3](https://github.com/cfware/babel-plugin-bundled-import-meta/issues/3)


### BREAKING CHANGES

* Drop support for generating node.js compatible
importStyle polyfill.  node.js targets can still be supported by letting
rollup output format handle the polyfill.
