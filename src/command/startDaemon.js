const fs = require('fs');
const spawn = require('child_process').spawn;
const path = require('path');
const controler = require('../controler');
const monitorPath = path.join(__dirname, '..', 'monitor', 'index');

// 一定要使用stream，或者 'ignore'
// 如果使用pipe链接的话，会使得当前process无法正常结束
const outFD = fs.openSync(path.join(controler.logDir, 'monitor.log'), 'a');
const errFD = fs.openSync(path.join(controler.logDir, 'monitor.error'), 'a');

module.exports = function startDaemon() {
    const monitor = spawn(process.execPath, [monitorPath], {
        stdio: ['ipc', outFD, errFD],
        detached: true
    })
    monitor.on('data', data => {
        console.log(data);
    })
    monitor.on('error', data => {
        console.log(data);
    })
    monitor.disconnect();
    monitor.unref();
    return monitor;
}
