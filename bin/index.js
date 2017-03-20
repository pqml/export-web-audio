#!/usr/bin/env node

'use strict'

const fs = require('fs')
const path = require('path')
const exportWebAudio = require('../src/exportWebAudio')
const minimist = require('minimist')
const sh = require('kool-shell')()
  .use(require('kool-shell/plugins/log'))
  .use(require('kool-shell/plugins/exit'))

const NOOP = function () {}
const CWD = process.cwd()
const minimistOpts = {
  string: [ 'output', 'bitrate' ],
  boolean: [ 'quiet', 'overwrite' ],
  alias: {
    overwrite: ['y'],
    output: ['o'],
    bitrate: ['b'],
    help: ['h'],
    quiet: ['q']
  }
}

const args = process.argv.slice(2)
const argv = minimist(args, minimistOpts)

const entry = argv._ && argv._[0] ? path.join(CWD, argv._[0]) : CWD
let opts = {}
Object.keys(minimistOpts.alias).forEach(key => {
  if (
  argv.hasOwnProperty(key) !== undefined &&
  typeof argv[key] !== 'undefined'
  ) {
    opts[key] = argv[key]
  }
})

if (opts.help) {
  sh.log(fs.readFileSync(path.join(__dirname, 'usage.txt'), 'utf-8'))
  sh.exit(0)
}

opts.input = entry
if (opts.output) opts.output = path.join(CWD, opts.output)

exportWebAudio(opts)
  .catch(err => NOOP(err))
