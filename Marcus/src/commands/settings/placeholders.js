const { Command: Base } = require('../../structures');

class Command extends Base {
	constructor(...args) {
		super(...args, {
			description: 'Lists placeholders available for greeting and farewell messages.',
			aliases: ['ph']
		 });
	}

	async run({ reply, member}) {
		await reply.embed({ 
            color: reply.colours.botcolour,
            description: "{{username}} == The user's username.\n{{discrim}} == The user's discriminator.\n{{tag}} == The user's tag.\n{{id}} == The user's ID.\n{{guild}} == The guild name.\n{{membercount}} == The guild's membercount."
			}, null, member);
	}
}

module.exports = Command;