/**
 * @author Stanislav Kalashnik <darkpark.main@gmail.com>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var name = 'livereload',
    log  = require('runner-logger').wrap(name);


function start ( config, done ) {
    var chokidar = require('chokidar'),
        server   = require('tiny-lr')(),
        watcher;

    function handler ( fileName ) {
        // reload
        server.changed({
            body: {files: [fileName]}
        });

        log.info('changed: %s', log.colors.magenta(fileName));
    }

    server.listen(config.port, function () {
        // port can be 0 from the start
        config.port = server.port;

        // report
        log.info('start server on port ' + config.port);
    });

    watcher = chokidar.watch(config.watch, config.watchOptions);
    watcher
        .on('change', handler)
        .on('unlink', handler)
        .on('add',    handler);

    return {
        server: server,
        watcher: watcher,
        done: done
    };
}


function stop ( instance ) {
    if ( instance ) {
        instance.server.close();
        instance.watcher.close();
        instance.done();
    }
}


function generator ( config, options ) {
    var tasks = {},
        instance;

    // sanitize and extend defaults
    generator.config = config = Object.assign({
        port: 35729,
        watchOptions: {
            ignoreInitial: true,
            awaitWriteFinish: {
                stabilityThreshold: 50
            }
        }
    }, config || {});
    options = Object.assign(generator.options, options || {});

    tasks[options.prefix + 'config' + options.suffix] = function () {
        log.inspect(config, log);
    };

    tasks[options.prefix + 'start' + options.suffix] = function ( done ) {
        instance = start(config, done);
    };

    tasks[options.prefix + 'stop' + options.suffix] = function () {
        stop(instance);
        instance = null;
    };

    return tasks;
}


// defaults
generator.options = {
    prefix: name + ':',
    suffix: ''
};


// export main actions
generator.methods = {
    start: start,
    stop: stop
};


// public
module.exports = generator;
