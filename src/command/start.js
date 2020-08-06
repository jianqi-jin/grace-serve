const Monitor = require('../monitor/monitor');
// 一定要使用stream，或者 'ignore'
// 如果使用pipe链接的话，会使得当前process无法正常结束

module.exports = function start() {
    let monitor = new Monitor();
    monitor.start();
}
