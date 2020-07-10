const {delay, typeCheck} = require('./util/util');
const {log, TAGS} = require('./util/log');
const {reloadDelay} = require('./readConfig');
function TaskMannger(cluster) {
    // 监听task列表，由此可以触发子进程热更，每一个task对应一个子进程热更函数
    this.taskMap = {};
    // 任务锁
    this.taskLock = false;
    // cluster
    this.cluster = cluster;
}


TaskMannger.prototype.reStart = function () {
    if (!this.cluster) {
        return;
    };
    let worker = this.cluster.fork();
    // 将子进程热更函数添加到taskMap，等待触发
    this.taskMap[worker.id] = () => new Promise(resolve => {
        // 执行task热更，此时删除当前task
        delete this.taskMap[worker.id];
        // 向子进程发送平滑重启信号
        worker.send('reStart');
        // 子程序处理完平滑重启，断开连接时
        worker.on('disconnect', () => {
            // 此时，子进程已经平滑断开，进行重启子进程
            this.reStart();
            // 子进程热更函数resolve
            setTimeout(() => {
                resolve(true);
            }, +reloadDelay < 50 ? +reloadDelay : 50);
        });
    });
    return worker;
};


TaskMannger.prototype.graceReload = async function () {
    if (this.taskLock) {
        return;
    }
    this.taskLock = true;
    log('start graceReload', TAGS.INFO);
    // 处理task
    try {
        for (let key in this.taskMap) {
            if (this.taskMap.hasOwnProperty(key)) {
                // 处理this.taskMap
                if (typeCheck(this.taskMap[key], 'Function')) {
                    await this.taskMap[key]();
                    await delay(reloadDelay);
                }
            }
        }
        log('success graceReload', TAGS.SUCCESS);

        this.taskLock = false;
    }
    catch (e) {
        console.log(e);
        this.taskLock = false;
    }
};

module.exports = {
    TaskMannger
};

