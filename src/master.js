const {delay} = require('./util/util');
const {workerNum} = require('./readConfig');
const {onSigterm} = require('./singnal');
const {TaskMannger} = require('./task');

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
    // fs.watch(__CurPath, (event, filename) => {
    //     if (!graceReloadOnFileChange) {
    //         return;
    //     }
    //     console.log(`文件变动：${filename}`);
    //     graceReload();
    // });

    // 退出时重启
    onSigterm(sig => {
        console.log(`
        收到信号：${sig}
        重启...`);
        task.graceReload();
    });
};

module.exports = masterProcess;
