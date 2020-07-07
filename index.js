#!/usr/bin/env node
const cluster = require('cluster');
const workProcess = require('./src/work');
const masterProcess = require('./src/master');
const {showConfig} = require('./src/readConfig');


// 读取config文件
const arg2 = process.argv[2];

if (arg2 === '-v' || arg2 === 'version' || arg2 === '-version') {
    showConfig();
    process.exit(0);
}

const main = async () => {
    if (cluster.isMaster) {
        masterProcess(cluster);
    }
    else {
        workProcess(cluster);
    }
};
main();
