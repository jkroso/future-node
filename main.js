const resolve = require('resolve-module')
const toRegex = require('glob-to-regexp')
const Module = require('module')
const path = require('path')
const fs = require('fs')

// must cache before monkey patch
require('./transforms/babel->js')

const match = (glob, file) => toRegex(glob, {extended: true}).test(file)

const findPackage = dir => {
  const file = path.join(dir, 'package.json')
  if (fs.existsSync(file)) return file
  if (dir == path.sep) return null
  return findPackage(path.dirname(dir))
}

const loadJSON = file => JSON.parse(fs.readFileSync(file, 'utf8'))

const load = Module.prototype.load

// monkey patch node's require()
Module.prototype.load = function(filename) {
  this.filename = filename
  this.paths = Module._nodeModulePaths(path.dirname(filename))
  var extension = path.extname(filename)
  if (extension != '.js' && Module._extensions[extension]) {
    Module._extensions[extension](this, filename)
    this.loaded = true
    return
  }

  const pkg = findPackage(filename)
  if (pkg == null) return load.call(this, filename)
  const dir = path.dirname(pkg)
  const json = loadJSON(pkg)
  if (!json.transpile) return load.call(this, filename)
  
  for (var i = 0, len = json.transpile.length; i < len; i++) {
    var spec = json.transpile[i]
    var glob = path.join(dir, spec[0])
    if (!match(glob, filename)) continue
    var mods = spec.slice(1)
    if (!Array.isArray(mods[0])) mods = [mods]
    var source = mods.reduce((source, mod) => {
      var path = mod[0]
      var options = mod[1]
      if (/^!sourcegraph\/(\w+->\w+)/.test(path)) {
        path = __dirname + '/transforms/' + RegExp.$1 + '.js'
      }
      try {
        var fn = require(resolve(dir, path))
      } catch (error) {
        error.message = `while requiring ${path} from ${pkg}: ${error.message}`
        throw error
      }
      return fn(source, filename, options)
    }, fs.readFileSync(filename))
    this._compile(source, filename)
    break
  }

  this.loaded = true
}
