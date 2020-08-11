const cluster = require('cluster');
const workProcess = require('./work');
const masterProcess = require('./master');
const {log, TAGS} = require('../util/log');
const { Console } = require('console');

log('grace loading...', TAGS.INFO);
if (cluster.isMaster) {
    masterProcess(cluster);
}
else {
    workProcess(cluster);
}


// process.on('message', data => {
//     console.log('grace get message:' + data);
//     if (data === 'restart') {
//         task.graceReload();
//     }
//     if (data === 'kill') {
//         process.disconnect();
//         setTimeout(() => {
//             process.exit(1);
//         }, 1e4);
//     }
// })

// process.on('message', data => {
//     console.log('收到了' + data);
//     setTimeout(() => {
//         // process.exit(0);
//     }, 3e3);
// })
