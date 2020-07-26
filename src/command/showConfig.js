const version = require('../../package.json');
module.exports = showConfig = () => {
    console.log(`

    name        :${version.name}
    
    version     :${version.version}

    description :${version.description}
    
    `);
};
