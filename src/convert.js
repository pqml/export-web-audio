'use strct'

const fs = require('fs')
const path = require('path')
const sh = require('kool-shell')()
  .use(require('kool-shell/plugins/exec'))
  .use(require('kool-shell/plugins/log'))

function convert (input, output, opts) {
  return new Promise((resolve, reject) => {
    const relInput = path.relative(opts.input, input)
    const relOutput = path.relative(opts.input, output)

    if (input === output) {
      if (!opts.quiet) {
        sh.warn('Skip ' + relInput + ' from converting itself')
      }
      resolve()
    }
    const args = [
      '-i', input,
      '-vn',
      '-ar', '44100',
      '-ac', '2',
      '-b:a', opts.bitrate + 'k',
      '-f', 'mp3', output
    ]

    if (opts.overwrite) args.unshift('-y')

    fs.access(output, fs.F_OK, (err) => {
      if (!err && !opts.overwrite) {
        if (!opts.quiet) sh.warn('Skip ' + relInput + ': destination file already exists')
        return resolve()
      }
      sh.silentExec('ffmpeg', args)
        .then(() => {
          if (!opts.quiet) sh.log(sh.colors.gray('✔︎ ' + relInput + ' → ' + relOutput))
          resolve()
        })
        .catch(out => {
          if (!opts.quiet) sh.error(out.stderr)
          resolve()
        })
    })
  })
}

module.exports = convert
