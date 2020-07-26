const cluster = require('cluster');
const workProcess = require('./work');
const masterProcess = require('./master');
const {showConfig} = require('./readConfig');
const {log, TAGS} = require('../util/log');


const grace = async () => {
    log('grace loading...', TAGS.INFO);
    if (cluster.isMaster) {
        masterProcess(cluster);
    }
    else {
        workProcess(cluster);
    }
};

module.exports = grace;

