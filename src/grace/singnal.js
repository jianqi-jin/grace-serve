module.exports.onSigterm = fn => {
    process.on('SIGTERM', fn);
}