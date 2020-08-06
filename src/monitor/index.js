/**
 * @file monitor/index.js
 * @author jinjianqi
 * @description 必须使用 child_process.spawn来启动 此文件
 *              如果不想通过后台的方式启动grace，请直接使用monitor.js
 */

// TODO jjq 完善 非后台启动情况
const Socket = require('../socket/socket');
const Monitor = require('./monitor');

function onMonitorStart() {
    let socket = new Socket(monitor);
    socket.start()
        .then(res => {
            console.log('monitor & socket start OK!');
        })
}

const monitor = new Monitor();
monitor.on('start', onMonitorStart);
monitor.on('data', console.log)
monitor.on('error', console.log)
monitor.start();
