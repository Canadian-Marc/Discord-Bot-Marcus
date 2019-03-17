const { Command: Base } = require('../../structures');

class Command extends Base {
	constructor(...args) {
	        super(...args, {			
                        description: 'Repeats what you say!',
                        args: [{ type: 'text', label: 'phrase' }],
                        guildOnly: true,
                        examples: ['say [text]']
                });
	}

        async run({ reply, args: [phrase], message }) {

                return reply.embed({ author: { name: `${message.member.username}#${message.member.discriminator}`, icon_url: message.member.avatarURL}, color: reply.colours.botcolour, description: phrase });

	}
}

module.exports = Command;