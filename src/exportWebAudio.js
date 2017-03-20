'use strict'

const path = require('path')
const fs = require('fs')
const commandExists = require('command-exists')
const convert = require('./convert')
const ensureDir = require('./ensureDir')
const sh = require('kool-shell')()
  .use(require('kool-shell/plugins/log'))

const COMMAND_ERROR_MSG = 'You need ffmpeg to use export-web-audio'
const SUCCESS_MSG = 'All files converted!'

const EXTS = [
  '.mp3',
  '.mp4',
  '.wav',
  '.aac',
  '.ogg',
  '.mov',
  '.webm',
  '.flac'
]

const defOpts = {
  input: process.cwd(),
  bitrate: 128,
  quiet: false,
  overwrite: false
}

function processPath (filePath, opts) {
  return new Promise((resolve, reject) => {
    fs.stat(filePath, (err, stats) => {
      if (err) {
        reject(err)
      } else if (stats.isDirectory()) {
        if (filePath === opts.output) {
          if (!opts.quiet) sh.warn('Skip output folder from converting itself')
          return resolve()
        }
        loadDir(filePath, opts)
          .then(resolve)
          .catch(reject)
      } else if (stats.isFile()) {
        const relPath = path.relative(opts.input, filePath)
        const outputPath = path.join(opts.output, relPath)
        if (!~EXTS.indexOf(path.extname(relPath))) return resolve()
        ensureDir(path.dirname(outputPath))
          .then(() => convert(filePath, outputPath, opts))
          .then(resolve)
          .catch(reject)
      } else {
        resolve()
      }
    })
  })
}

function loadDir (dirPath, opts) {
  return new Promise((resolve, reject) => {
    let p = []
    fs.readdir(dirPath, (err, files) => {
      if (err) return reject(err)
      files.forEach((file) => {
        const filePath = path.join(dirPath, file)
        p.push(processPath(filePath, opts))
      })
      Promise.all(p)
        .then(resolve)
        .catch(reject)
    })
  })
}

function exportWebAudio (opts) {
  return new Promise((resolve, reject) => {
    opts = Object.assign({}, defOpts, opts)
    if (!opts.output) opts.output = opts.input

    commandExists('ffmpeg', (err, commandExists) => {
      if (err) return reject(err)
      if (!commandExists) {
        if (!opts.quiet) sh.error(COMMAND_ERROR_MSG)
        return reject(new Error(COMMAND_ERROR_MSG))
      }
      if (!opts.quiet) sh.log('⏳  Converting audio/video files...')
      processPath(opts.input, opts)
        .then(res => {
          if (!opts.quiet) sh.success(SUCCESS_MSG)
          resolve(res)
        })
        .catch(err => {
          if (!opts.quiet) sh.error(err)
          reject(err)
        })
    })
  })
}

module.exports = exportWebAudio
