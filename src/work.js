const {entryPath} = require('./readConfig');
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
                }, 5000);
            }
        }
        catch (e) {
            console.log('平滑关闭server失败');
            console.log(e);
        }
    });
}

module.exports = workProcess;