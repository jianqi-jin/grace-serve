const {delay} = require('./util/util');
const {workerNum, graceReloadOnFileChange} = require('./readConfig');
const {onSigterm} = require('./singnal');
const {TaskMannger} = require('./task');
const chokidar = require('chokidar');
const {log, TAGS} = require('./util/log');
let task;
const masterProcess = async cluster => {
    if (!task) {
        task = new TaskMannger(cluster);
    }
    // 父进程
    for (let i = 0; i < workerNum; ++i) {
        task.reStart();
        await delay(1000);
    }
    // 监听文件变动
    let __curPath = process.cwd();
    const watcher = chokidar.watch(__curPath);
    watcher.on('change', filename => {
        if (!graceReloadOnFileChange) {
            return;
        }
        log(`文件变动：${filename}`, TAGS.INFO);
        task.graceReload();
    });

    // 退出时重启
    onSigterm(sig => {
        log(`
            收到信号：${sig}
            重启...`,
            TAGS.INFO
        );

        task.graceReload();
    });
    log('grace start success', TAGS.SUCCESS);
};

module.exports = masterProcess;
