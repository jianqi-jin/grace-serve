var fs = require('fs');
const delay = async time => new Promise(resolve => setTimeout(resolve, time));

const typeCheck
    = (target, type) => Object.prototype.toString.call(target) === `[object ${type}]`;

const tryCreateDir = path => {
    try {
        if (fs.existsSync(path)) {
            return;
        }
        fs.mkdirSync(path, '0755');
    }
    catch (e) {
        throw new Error('Failed create ' + path + ':' + e.message);
    }
}
module.exports = {
    delay,
    typeCheck,
    tryCreateDir
};

