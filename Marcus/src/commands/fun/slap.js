const { Command: Base } = require('../../structures');
class Command extends Base {
	constructor(...args) {
		super(...args, {			
        description: 'Hit someone!',
        guildOnly: true,
        aliases: ['spank', 'smack'],
        examples: ['slap', 'slap [mention]']
        });
    }
    
async run({ reply, author, message }) {
    let s = message.mentions.map(m => m.username).join(', ')
        if(!s) {
            return reply(`:raised_hand: ${author.username} slapped themself! :raised_hand:`)
        }
        return reply(`:raised_hand: ${author.username} slapped *${s}!* :raised_hand:`)
	}
}
module.exports = Command;