const gulp = require('gulp')
const runSequence = require('run-sequence')
const path = require('path')
const rimraf = require('rimraf')
const imageResize = require('gulp-image-resize')
const foreach = require('gulp-foreach')
const base64img = require('gulp-base64-img')
const append = require('gulp-append')
const fs = require('fs')
const jsonFormat = require('gulp-json-format')

const OUTPUT_FILENAME = 'base64.json';

gulp.task('clean', (cb) => {
  return rimraf('./dist', cb)
})

gulp.task('images', () => {
  return gulp
    .src('./images/**/*')
    .pipe(imageResize({width : 20}))
    .pipe(gulp.dest('./dist'))
})

gulp.task('base64', () => {
  fs.mkdirSync('./dist/json')
  return gulp
    .src('./dist/**/*')
    .pipe(foreach((stream, file) => {
      filename = path.basename(file.path)
      return stream
        .pipe(base64img())
        .pipe(append(`dist/json/${filename}.json`))
    }))
})

gulp.task('combineJson', () => {
  let data = []
  let dirPath = './dist/json/'
  let fileNames = fs.readdirSync(dirPath)
  fileNames.forEach((filename) => {
    let fileData = fs.readFileSync(dirPath + filename, 'utf-8')
    data.push({
      base64: JSON.parse(fileData)[0],
      name: filename
    })
  })
  fs.writeFile(
    path.join('dist/', OUTPUT_FILENAME),
    JSON.stringify(data),
    (err) => {
      if(err){ throw err
    }}
  )
})

gulp.task('prettyJson', () => {
  return gulp
    .src(path.join('dist/', OUTPUT_FILENAME))
    .pipe(jsonFormat(2))
    .pipe(gulp.dest('./dist/'))
})

gulp.task('default', () => {
  runSequence(
    'clean',
    'images',
    'base64',
    'combineJson',
    'prettyJson',
    () => console.log('All done!')
  )
})
