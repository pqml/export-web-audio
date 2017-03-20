# export-web-audio
### Export clean samples to avoid crackling sounds with the WebAudioAPI on iOS

<br><br>

## Requirements
+ Node version >= 4
+ npm cersion >= 2
+ `ffmpeg` CLI installed
  + On OSX you can use `brew` to install it easily with `brew install ffmpeg`

<br><br>

## CLI Usage

#### installation
```
npm install -g export-web-audio
```

#### usage
```
export-web-audio
export-web-audio INPUT
export-web-audio INPUT -o <output>
export-web-audio INPUT -b <bitrate> --quiet --overwrite

Options:
  -h, --help        Show this screen.
  -o, --output      Output file or directory
  -b, --bitrate     Encoding bitrate (default: 128kbps)
  -q, --quiet       Suppress log messages
  -y, --overwrite   Overwrite output files if they already exist

```

<br><br>

## Node.js Usage

#### installation
```
npm install -S export-web-audio
```

#### usage
```js
var exportWebAudio = require('export-web-audio')
exportWebAudio(options)
```

### options

+ **`options.input`**
  + Input file or directory
  + *default `process.cwd()`*

+ **`options.output`**
  + Output file or directory
  + *default `process.cwd()`*

+ **`options.bitrate`**
  + Set the encoding bitrate
  + *default `128`*

+ **`options.overwrite`**
  + Overwrite output files if they already exist
  + *default `false`*

+ **`options.quiet`**
  + Don't display any log messages
  + *default `false`*

<br><br>

## License
[MIT](https://tldrlegal.com/license/mit-license).