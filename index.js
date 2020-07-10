#!/usr/bin/env node
const cluster = require('cluster');
const workProcess = require('./src/work');
const masterProcess = require('./src/master');
const {showConfig} = require('./src/readConfig');
const {log, TAGS} = require('./src/util/log');
// 读取config文件
const arg2 = process.argv[2];

if (arg2 === '-v' || arg2 === 'version' || arg2 === '-version') {
    showConfig();
    process.exit(0);
}

const main = async () => {
    log('grace loading...', TAGS.INFO);
    if (cluster.isMaster) {
        masterProcess(cluster);
    }
    else {
        workProcess(cluster);
    }
};
main();


