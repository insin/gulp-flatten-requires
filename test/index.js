var fs = require('fs')

var gutil = require('gulp-util')
var test = require('tape')

var flattenRequires = require('../')
var fixture = fs.readFileSync(__dirname + '/files/fixture.js', 'utf8')
var expected = fs.readFileSync(__dirname + '/files/expected.js', 'utf8')

test('gulp-flatten-requires', function(t) {
  t.plan(1)

  var stream = flattenRequires()

  stream.on('data', function(file) {
    t.equal(file.contents.toString(), expected, 'relative requires are rewritten, with quote style preserved')
  })

  stream.write(new gutil.File({
    path: 'fixture.js'
  , contents: new Buffer(fixture)
  }))
})