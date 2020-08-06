/**
 * @file monitor.js
 * @author jinjianqi
 * @description monitor文件的作用是启动和监控grace chlid process，并通过socket和cli通信
 */

const utile = require('utile');
const events = require('events');
const path = require('path');
const spawn = require('child_process').spawn;
const controler = require('../controler');
const fs = require('fs');

const Monitor = module.exports = function () {
    this.server = null;
    this.running = false;
    this.reStart = false;
}


// 继承events.EventEmitter类
utile.inherits(Monitor, events.EventEmitter);

Monitor.prototype.start = function () {
    // 创建grace.Log file 收集log日志
    if (!fs.existsSync(controler.logDir)) {
        this.emit('error', new Error(controler.logDir + 'not exists'));
        return;
    }
    const graceLog = fs.openSync(path.join(controler.logDir, 'grace.log'), 'a')
    const graceError = fs.openSync(path.join(controler.logDir, 'grace.error'), 'a')
    // grace 子进程
    const gracePath = path.join(__dirname, '..', 'grace', 'index');
    console.log(gracePath);
    const child = spawn(process.execPath, [gracePath], {
        stdio: ['ipc', graceLog, graceError],
        detached: true
    });
    this.on('restart', () => {
        child.send('restart');
    })
    this.on('kill', () => {
        child.send('kill');
    })
    
    this.child = child;
    if (!this.reStart) {
        this.reStart = false;
        this.emit('start');
    }
    child.on('exit', () => {
        console.log('server exit');
        process.nextTick(() => {
            this.reStart = true;
            this.start();
        })
    })
    child.on('close', () => {
        console.log('server close');
    })
    child.on('error', () => {
        console.log('server error');
    })
}