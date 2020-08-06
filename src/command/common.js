const nssocket = require('nssocket');
const fs = require('fs');

exports.getSocketFiles = dir => {
    let sockets;
    try {
        sockets = fs.readdirSync(dir);
        return sockets;
    }
    catch (e) {
        return [];
    }
}

exports.getSocket = socketPath => new Promise((resolve, reject) => {
    const socket = new nssocket.NsSocket();
    socket.on('error', err => {
        fs.unlink(socketPath, err => {
            resolve(null);
            return;
        })
    })
    socket.connect(socketPath, err => {
        if (err) {
            resolve(null);
            return;
        }
        else {
            socket.end();
            resolve(socketPath);
        }
    })
})

exports.getProcess = socketPath => new Promise((resolve, reject) => {
    const socket = new nssocket.NsSocket();
    socket.on('error', err => {
        fs.unlink(socketPath, err => {
            resolve(null);
            return;
        })
    })
    socket.connect(socketPath, err => {
        if (err) {
            resolve(null);
            return;
        }
        else {
            // TODO 通过socket发送信息
            socket.data('getProcess', resolve);
            socket.send('getProcess');
            socket.end();
        }
    })
})
    .catch(() => resolve(null));


