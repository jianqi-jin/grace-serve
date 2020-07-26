const {log, TAGS} = require('../util/log');
const grace = require('../grace/index');

module.exports = function start() {
    log('starting...', TAGS.INFO);
    grace();
}
