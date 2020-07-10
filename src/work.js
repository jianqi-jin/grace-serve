const {entryPath, workerTimeOut} = require('./readConfig');
const {TAGS, log} = require('./util/log');
function workProcess(cluster) {
    // 启动入口server
    let server = require(entryPath);
    // 子进程
    cluster.worker.on('message', async msg => {
        try {
            if (msg === 'reStart') {
                // 此处平滑关闭
                server.close();
                // 断开连接
                cluster.worker.disconnect();
                setTimeout(() => {
                    // 5s不断开，强制退出
                    process.exit(1);
                }, workerTimeOut);
            }
        }
        catch (e) {
            log('平滑关闭server失败\n请确保server导出了server实例: 例如: \n module.exports = server;', TAGS.FAILED);
            console.log(e);
        }
    });
}

module.exports = workProcess;