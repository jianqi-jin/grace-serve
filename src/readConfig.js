const __CurPath = process.cwd();
let configPath = __CurPath + '/grace-config.js';
const config = require(configPath);
const {workerNum = 2, graceReloadOnFileChange = true} = config;
const entryPath = __CurPath + '/' + config.entry;

const showConfig = () => {
    const version = require(__dirname + '/package.json');
    console.log(`

    name        :${version.name}
    
    version     :${version.version}
    
    `);
};

module.exports = {
    showConfig,
    workerNum,
    entryPath
};


