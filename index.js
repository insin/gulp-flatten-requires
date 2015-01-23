'use strict';

var gutil = require('gulp-util')
var through = require('through2')
var recast = require('recast')

module.exports = function(options) {
  return through.obj(function(file, encoding, cb) {
    if (file.isNull()) {
      return cb(null, file)
    }

    if (file.isStream()) {
      return cb(new gutil.PluginError('gulp-flatten-requires', 'Streaming is not supported.'))
    }

    try {
      file.contents = new Buffer(recast.print(recast.visit(recast.parse(file.contents.toString()), {
        visitCallExpression: function(path) {
          var expr = path.node
          if (expr.callee.name == 'require') {
            this.traverse(path)
            if (expr.arguments.length && expr.arguments[0].value.charAt(0) == '.') {
              var arg = expr.arguments[0]
              expr.arguments[0] = arg.raw.charAt(0) + './' + arg.value.split('/').pop() + arg.raw.charAt(0)
            }
          }
          else {
            return false
          }
        }
      })).code)
      this.push(file)
    }
    catch (e) {
      this.emit('error', new gutil.PluginError('gulp-flatten-requires', e, {fileName: file.path}))
    }

    cb()
  })
}