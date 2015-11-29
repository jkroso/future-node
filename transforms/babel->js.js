const preset = require('babel-preset-node-giovanni')
const babel = require('babel-core')

module.exports = (source, filename, options) => {
  options = Object.create(options || null)
  options.filename = filename
  options.presets = (options.presets || []).concat(preset)
  return babel.transform(source, options).code
}
