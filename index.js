/**
 * @author Stanislav Kalashnik <darkpark.main@gmail.com>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

const
    name = 'livereload',
    log  = require('runner-logger').wrap(name);


function start ( config, done ) {
    const
        chokidar = require('chokidar'),
        server   = require('tiny-lr')(),
        watcher  = chokidar.watch(config.watch, config.watchOptions);

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


function generator ( config = {}, options = {} ) {
    const
        tasks = {},
        {prefix = name + ':', suffix = ''} = options;

    let instance;

    // sanitize and extend defaults
    config = Object.assign({
        port: 35729,
        watchOptions: {
            ignoreInitial: true,
            awaitWriteFinish: {
                stabilityThreshold: 50
            }
        }
    }, config);

    tasks[prefix + 'config' + suffix] = function () {
        log.inspect(config, log);
    };

    tasks[prefix + 'start' + suffix] = function ( done ) {
        instance = start(config, done);
    };

    tasks[prefix + 'stop' + suffix] = function () {
        stop(instance);
        instance = null;
    };

    return tasks;
}


// export main actions
generator.methods = {
    start: start,
    stop: stop
};


// public
module.exports = generator;
