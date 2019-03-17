const { Command: Base } = require('../../structures');
class Command extends Base {
	constructor(...args) {
		super(...args, {			
        description: 'Show your anger towards someone!',
        guildOnly: true,
        examples: ['punch', 'punch [mention]']
        });
    }
    
async run({ reply, author, message }) {
    let p = message.mentions.map(m => m.username).join(', ')
        if(!p) {
            return reply(`:right_facing_fist: ${author.username} punched themself! :right_facing_fist:`)
        }
        return reply(`:right_facing_fist: ${author.username} punched *${p}!* :right_facing_fist:`)
	}
}
module.exports = Command;