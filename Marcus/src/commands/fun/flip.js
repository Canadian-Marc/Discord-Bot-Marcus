const { Command: Base } = require('../../structures/');
class Command extends Base {
	constructor(...args) {
		super(...args, {			
        description: 'Flip a coin!'
        });
    }
    
async run({ reply }) {
    const r = ["The coin has landed on **tails**!", "The coin has landed on **heads**!"];
        var re = Math.floor((Math.random() * r.length) + 0);
    
    return reply(r[re])
}}
module.exports = Command;