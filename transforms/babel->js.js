const preset = require('babel-preset-node-giovanni')
const babel = require('babel-core')

module.exports = (source, filename, options) => {
  options = Object.create(options || null)
  options.filename = filename
  options.presets = (options.presets || []).concat(preset)
  options.sourceMaps = true
  options.ast = false
  return babel.transform(source, options)
}
