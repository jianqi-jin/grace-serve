const start = require('./start');
const stop = require('./stop');
const {findArg} = require('./argReader');
const showConfig = require('./showConfig');

function command() {
    if (findArg(['start', '-start', '--start'])) {
        start();
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
}

module.exports = command;