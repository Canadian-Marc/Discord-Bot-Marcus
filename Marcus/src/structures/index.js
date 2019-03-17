const fs = require('fs');

fs.readdirSync(__dirname).forEach(structure => {
	if(structure !== 'index.js') module.exports[structure.replace('.js', '')] = require(`${__dirname}/${structure}`);
});
