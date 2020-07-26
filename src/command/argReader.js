const {log, TAGS} = require('../util/log');
function findArg() {
    let {length = 0} = arguments;
    let targets = null;
    if (length < 1) {
        log('findArg函数需要接受一个参数', TAGS.FAILED);
        return;
    }
    if (Array.isArray(arguments[0])) {
        if (length > 1) {
            log('findArg函数如果接受array类型参数的话，只能有一个参数', TAGS.FAILED);
            return;
        }
        targets = arguments[0];
    }
    else {
        targets = Object.values(arguments);
    }
    if (targets.some(v => typeof v !== 'string')) {
        log('findArg函数的target需要为string类型', TAGS.FAILED);
        return;
    };
    let {argv} = process;
    let args = new Set(argv);
    return targets.some(v => args.has(v));
}

module.exports = {
    findArg
};