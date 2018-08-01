Tasks generator for LiveReload
==============================

[![build status](https://img.shields.io/travis/runner/generator-livereload.svg?style=flat-square)](https://travis-ci.org/runner/generator-livereload)
[![npm version](https://img.shields.io/npm/v/@runner/generator-livereload.svg?style=flat-square)](https://www.npmjs.com/package/@runner/generator-livereload)
[![dependencies status](https://img.shields.io/david/runner/generator-livereload.svg?style=flat-square)](https://david-dm.org/runner/generator-livereload)
[![devDependencies status](https://img.shields.io/david/dev/runner/generator-livereload.svg?style=flat-square)](https://david-dm.org/runner/generator-livereload?type=dev)
[![Gitter](https://img.shields.io/badge/gitter-join%20chat-blue.svg?style=flat-square)](https://gitter.im/DarkPark/runner)
[![RunKit](https://img.shields.io/badge/RunKit-try-yellow.svg?style=flat-square)](https://npm.runkit.com/@runner/generator-livereload)


## Installation ##

```bash
npm install @runner/generator-livereload
```


## Usage ##

Add to the scope:

```js
var generator = require('@runner/generator-livereload');
```

Generate tasks according to the given config:

```js
var tasks = generator({
    watch: [
        'build/develop/**/*',
        '!build/develop/**/*.map'
    ]
});
```

Add generated tasks to the `runner` instance:

```js
var runner = require('runner');

Object.assign(runner.tasks, tasks);
```

The following tasks will become available:

 Task name           | Description
---------------------|-------------
 `livereload:config` | prints the current configuration used for generated tasks
 `livereload:start`  | starts file changes monitoring, sends reload command on modifications
 `livereload:stop`   | stops watcher and server

Generator accepts two arguments: base configuration and additional options.


### Base configuration ###

It's an object with the following properties:

 Name         | Description
--------------|-------------
 port         | livereload server port (default: `35729`)
 watch        | file, dir, glob, or array passed to `watch` in [chokidar](https://www.npmjs.com/package/chokidar#api)
 watchOptions | optional watcher [options](https://www.npmjs.com/package/chokidar#api)


### Additional options ###

It's an object with the following properties:

 Name   | Description
--------|-------------
 prefix | an affix placed before a task name (default is `livereload:`)  
 suffix | a string added at the end of a task name (empty by default)
 
So it's possible to change generated tasks names: 

```js
Object.assign(runner.tasks,
    generator(config, {
        prefix: 'lr:',
        suffix: ':develop'
    })
);
```

It will add the following tasks:

* `lr:config:develop` 
* `lr:start:develop`  
* `lr:stop:develop`  
 

## Contribution ##

If you have any problems or suggestions please open an [issue](https://github.com/runner/generator-livereload/issues)
according to the contribution [rules](.github/contributing.md).


## License ##

`@runner/generator-livereload` is released under the [GPL-3.0 License](http://opensource.org/licenses/GPL-3.0).
