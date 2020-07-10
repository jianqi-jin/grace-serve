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
// 参数说明：
// 柯里化接受参数
// 需要传入worker任务hash列表task实例 和执行回调
// 函数说明：
// 此函数在当worker断开链接时执行
// 首先运行addWorker函数fork一个新的worker，执行server流程
// 之后执行callback
let onWorkerDisConnected = (task, callBack) => async () => {
    // 此时，子进程已经平滑断开，进行重启子进程
    try {
        await task.addWorker();
        // 子进程热更函数callBack
        log('worker fork success!', TAGS.SUCCESS);
        await delay(+reloadDelay < 50 ? +reloadDelay : 50);
        callBack(true);
    }
    catch (e) {
        log('worker fork timeOut!', TAGS.FAILED);
        callBack(true);
    }
};
// 将子进程热更函数添加到taskMap，等待触发
// 参数说明：
// 需要接受task对象 和 具体的worker,是一个工厂函数
// 此工厂函数返回一个可以close worker的执行函数
// 用来完成给具体的worker发送关闭信息
let taskWorkerFunc = (task, worker) => () => new Promise(resolve => {
    // 执行task热更，此时删除当前task
    delete task.taskMap[worker.id];
    // 向子进程发送关闭信号
    worker.send('close');
    // 子程序处理完关闭，断开连接时
    worker.on('disconnect', onWorkerDisConnected(task, resolve));
});
// 保证worker fork初始化完成
// 需要为worker 添加回调
// 使用函数柯里化接受参数
let onWorkerForkSuccess = (successCallBack, failCallback) => async msg => {
    if (msg === 'forkSuccess') {
        successCallBack();
        return;
    }
    await delay(5000);
    failCallback();
};
// addWorker函数
// 此函数将fork出一个新的worker
// 当fork完成后worker将运行server流程
// server流程运行完毕，worker将发送forker success message
// 此函数进行监听信息，收到fork success 之后，将此worker 添加如taskMap
// 之后如果重启，则执行 graceReload 函数 即可运行taskMap里面的函数对worker进行关闭
TaskMannger.prototype.addWorker = function () {
    if (!this.cluster) {
        log('there is no cluster', TAGS.FAILED);
        return;
    }
    let worker = this.cluster.fork();
    // 返回一个promise
    return new Promise((resolve, reject) => {
        worker.on('message', onWorkerForkSuccess(resolve, reject));
        this.taskMap[worker.id] = taskWorkerFunc(this, worker);
    });
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

