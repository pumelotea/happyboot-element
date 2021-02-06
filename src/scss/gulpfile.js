'use strict'
/* eslint-disable @typescript-eslint/no-var-requires */
const { series, src, dest } = require('gulp')
const sass = require('gulp-dart-sass')
const autoprefixer = require('gulp-autoprefixer')
const cssmin = require('gulp-cssmin')
const rename = require('gulp-rename')

const themes = ['dark','light']

const noElPrefixFile = /(index|base|display|default)/

function compile() {
  return src('./src/default.scss')
    .pipe(sass.sync())
    .pipe(autoprefixer({ cascade: false }))
    .pipe(cssmin())
    .pipe(rename(function (path) {
      if(!noElPrefixFile.test(path.basename)) {
        path.basename = `el-${path.basename}`
      }
    }))
    .pipe(dest('../../public/theme/dark'))
}

function copyfont() {
  return src('./src/fonts/**')
    .pipe(cssmin())
    .pipe(dest('../../public/theme/dark/fonts'))
}

exports.build = series(compile, copyfont)
