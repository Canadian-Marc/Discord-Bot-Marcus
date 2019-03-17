const { Command: Base } = require('../../structures');
class Command extends Base {
	constructor(...args) {
		super(...args, {			
        description: 'Give someone a hug!',
        guildOnly: true,
        examples: ['hug', 'hug [mention]']
        });
    }
    
async run({ reply, author, message }) {
    let h = message.mentions.map(m => m.username).join(', ')
        if(!h) {
            return reply(`:hugging: ${author.username} is hugging themself..? :hugging:`)
        }
        return reply(`:hugging: ${author.username} hugged *${h}!* :hugging:`)
	}
}
module.exports = Command;