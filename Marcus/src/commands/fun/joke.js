const { Command: Base } = require('../../structures');
const superagent = require('superagent')
class Command extends Base {
	constructor(...args) {
		super(...args, {			
        description: 'Grab a random joke!'
        });
    }
    
async run({ reply }) {
	const { body: jv } = await superagent('https://icanhazdadjoke.com').accept("application/json");
    return await reply(`${jv.joke}`);
	}}
module.exports = Command;