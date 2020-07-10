const {entryPath, workerTimeOut} = require('./readConfig');
const {TAGS, log} = require('./util/log');
const {delay} = require('./util/util');

const onMessageClose = (server, worker) => async msg => {
    try {
        if (msg === 'close') {
            // 此处平滑关闭
            server.close();
            // 断开连接
            log('worker close', TAGS.INFO);
            worker.disconnect();
            // 5s不断开，强制退出
            await delay(workerTimeOut);
            process.exit(1);
        }
    }
    catch (e) {
        log('平滑关闭server失败\n请确保server导出了server实例: 例如: \n module.exports = server;', TAGS.FAILED);
        console.log(e);
    }
}

function workProcess(cluster) {
    // 启动入口server
    let server = require(entryPath);
    // 子进程
    cluster.worker.on('message', onMessageClose(server, cluster.worker));

    // fork成功，发送消息
    cluster.worker.send('forkSuccess');
}

module.exports = workProcess;