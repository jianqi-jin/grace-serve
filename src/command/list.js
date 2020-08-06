const nssocket = require('nssocket');
const controler = require('../controler');
const fs = require('fs');
const path = require('path');
const {getSocketFiles, getProcess} = require('./common');



const list = module.exports = async function() {
    let count = 0;
    let sockets = getSocketFiles(controler.socketDir);
    for (let i = 0; i < sockets.length; ++i) {
        let res = await getProcess(path.join(controler.socketDir, sockets[i]));
        if (res) {
            count++;
            let {child = {}} = res || {};
            console.log(child.pid, (child.spawnargs || []).join('-->'));
        }
    }
    console.log('总计：' + count);
}


