'use strict'

const fs = require('fs-extra')

function ensureDir (dir) {
  return new Promise((resolve, reject) => {
    fs.ensureDir(dir, err => {
      if (err) reject(err)
      resolve()
    })
  })
}

module.exports = ensureDir
