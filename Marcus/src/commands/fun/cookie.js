const { Command: Base } = require('../../structures/');
class Command extends Base {
	constructor(...args) {
		super(...args, {			
        description: 'Share or keep all the cookies to yourself!'
        });
    }
    
async run({ reply, author, message }) {
    let cg = message.mentions.map(m => m.username).join(', ')
        if(!cg) {
            return reply(`:cookie: ${author.username} has kept all the cookies for themself. :cookie:`)
        }
        return reply(`:cookie: ${author.username} shared their cookies with *${cg}*! :cookie:`)
	}
}
module.exports = Command;