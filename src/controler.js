const { tryCreateDir } = require("./util/util");
const path = require('path');

const control = exports;

// TODO socket 基础地址文件夹，通过 grace config 进行配置。
var rootDir = path.join(process.env.HOME || '/root', '.grace');
var socketDir = path.join(rootDir, 'socket');
var logDir = path.join(rootDir, 'log');


// 初始化control init
const init = () => {

    // 创建socket目录
    tryCreateDir(rootDir);
    tryCreateDir(socketDir);
    tryCreateDir(logDir);

    // 将socket目录进行挂载
    control.rootDir = rootDir;
    control.socketDir = socketDir;
    control.logDir = logDir;
}






// 当程序启动时运行初始化函数
init();
