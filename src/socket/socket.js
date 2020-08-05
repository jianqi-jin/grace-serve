var nssocket = require('nssocket');
var path = require('path');
var utile = require('utile');
const { Socket } = require('dgram');
// TODO socket 基础地址文件夹，通过 grace config 进行配置。
var socketRootDir = __dirname + '/socket';

var SocketMannager = function (grace) {
    // 通过grace 启动socket
    this.grace = grace;
    this._socket = null;
    this._socketPath = '';
}


Socket.prototype.start = function () {
    this._sockPath = path.join(socketRootDir,
        [
            new Date().getTime() + utile.randomString(3),
            'socket'
        ].join('.')
    );
    this._socket = nssocket.NsSocket
}
