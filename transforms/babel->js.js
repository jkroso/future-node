const babel = require('babel-core')

const plugins = [
	'async-to-generator',
	'class-properties',
	'es2015-destructuring',
	'es2015-modules-commonjs',
	'es2015-parameters',
	'es2015-unicode-regex',
	'exponentiation-operator',
	'function-bind',
	'object-rest-spread'
].map(name => 'babel-plugin-transform-' + name)
 .map(require)
 .concat(require('babel-plugin-syntax-jsx'))
 .concat(require('jsx-to-js').babel_plugin)
 .concat(require('@jkroso/babel-plugin-runtime'))

module.exports = (source, filename, options) => {
  options = Object.assign({}, options || null)
  delete options.stage
  options.filename = filename
  options.plugins = (options.plugins || []).concat(plugins)
  options.sourceMaps = true
  options.ast = false
  return babel.transform(source, options)
}
