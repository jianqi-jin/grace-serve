var nssocket = require('nssocket');
var path = require('path');
var utile = require('utile');
var util = require('../util/util');
var controler = require('../controler');

var Socket = module.exports = function (monitor) {
    // 通过grace 启动socket
    this.monitor = monitor;
    this._socket = null;
    this._socketFile = '';
}



Socket.prototype.start = function () {
    let self = this;
    return new Promise((resolve, reject) => {
        this._socketFile = path.join(controler.socketDir,
            [
                new Date().getTime() + utile.randomString(3),
                'socket'
            ].join('.')
        );
        this._socket = nssocket.createServer(onServerCreated);
        this._socket.on('listening', () => {
            resolve(this._socketFile);
        });
        function onServerCreated(socket) {
            socket.on('error', function() {
                socket.destroy();
            });
            socket.data(['data'], () => {
                console.log('get socket data');
            });
            socket.data('getProcess', () => {
                socket.send('getProcess', self.monitor);
            });
            // self.monitor.on('exit', data => {
                // console.log(data);
                // self.monitor.start();
            // });
            socket.data('kill', () => {
                self.monitor.emit('kill');
                socket.send('kill');
                process.exit();
            });
        }
        this._socket.listen(this._socketFile);
    })
};
