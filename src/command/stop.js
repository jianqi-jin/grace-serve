const {log, TAGS} = require('../util/log');
const {getSocketFiles, getSocket} = require('./common');
const controler = require('../controler');
const path = require('path');
const { NsSocket } = require('nssocket');
const socket = require('../socket/socket');

module.exports = async function stop() {
    log('stoping...', TAGS.INFO);
    // TODO 可以考虑将controler的引用抽象
    const sockets = getSocketFiles(controler.socketDir);
    for (let i = 0; i < sockets.length; ++i) {
        let socketPath = await getSocket(path.join(controler.socketDir, sockets[i]));
        if (!socketPath) {
            continue;
        }
        let socket = new NsSocket();
        socket.on('error', err => {
            console.log(err);
        })
        console.log(socketPath);
        socket.connect(socketPath, err => {
            if (err) {
                console.log(err);
                return;
            }
            socket.dataOnce('kill', () => {
                console.log('kill OK!');
                socket.end();
            });
            socket.send('kill');
        });

    }
}

