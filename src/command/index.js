const start = require('./start');
const stop = require('./stop');
const list = require('./list');
const {findArg} = require('./argReader');
const showConfig = require('./showConfig');
const startDaemon = require('./startDaemon');

function command() {
    if (findArg(['start', '-start', '--start'])) {
        start();
        return;
    };
    if (findArg(['startDeamon', '-sd', '--startDeamon'])) {
        startDaemon();
        return;
    };
    if (findArg('stop', '-stop', '--stop')) {
        stop();
        return;
    }
    if (findArg('kill', '-kill', '--kill')) {
        // kill();
        return;
    }
    if (findArg('info', '-info', '-i', '--info')) {
        return;
    }
    if (findArg('version', '-version', '-v', '--version')) {
        showConfig();
        return;
    }
    if (findArg('list', '-list', '-ls', '--list')) {
        list();
        return;
    }
}

module.exports = command;