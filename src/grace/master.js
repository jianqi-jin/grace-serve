const {delay} = require('../util/util');
const {workerNum, graceReloadOnFileChange} = require('./readConfig');
const {onSigterm} = require('./singnal');
const {TaskMannger} = require('./task');
const chokidar = require('chokidar');
const {log, TAGS} = require('../util/log');
let task;

const initWorker = async task => {
    // 父进程
    for (let i = 0; i < workerNum; ++i) {
        task.addWorker();
        await delay(1000);
    }
}
const watchfiles = task => {
    // 监听文件变动
    let __curPath = process.cwd();
    const watcher = chokidar.watch(__curPath);
    const fileChanged = filename => {
        if (!graceReloadOnFileChange) {
            return;
        }
        log(`文件变动：${filename}`, TAGS.INFO);
        task.graceReload();
    }
    watcher.on('change', fileChanged);
}
const getTask = (task, cluster) => {
    if (!task) {
        task = new TaskMannger(cluster);
    }
    return task;
};
const onKill = task => sig => {
    log(`
        收到信号：${sig}
        重启...`,
        TAGS.INFO
    );
    task.graceReload();
}

const masterProcess = async cluster => {
    task = getTask(task, cluster);
    await initWorker(task);
    watchfiles(task);
    // 退出时重启
    onSigterm(onKill(task));
    log('grace start success', TAGS.SUCCESS);
};

module.exports = masterProcess;
