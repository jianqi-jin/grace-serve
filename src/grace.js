const cluster = require('cluster');
const workProcess = require('./work');
const masterProcess = require('./master');
const {showConfig} = require('./readConfig');
const {log, TAGS} = require('./util/log');
// 读取config文件
const arg2 = process.argv[2];

if (arg2 === '-v' || arg2 === 'version' || arg2 === '-version') {
    showConfig();
    process.exit(0);
}

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

