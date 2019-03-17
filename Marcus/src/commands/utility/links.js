const { Command: Base } = require('../../structures');

class Command extends Base {
	constructor(...args) {
		super(...args, {
			description: 'Links related to Marcus.',
			aliases: ['invite', 'lounge']
		 });
	}

	async run({ reply, member}) {
		await reply.embed({ 
			color: reply.colours.botcolour, 
			fields: [
				{name: 'Invites', value: `[Marcus](https://discordapp.com/oauth2/authorize?client_id=292070948318740481&scope=bot&permissions=8)\n[Marcus Beta](https://discordapp.com/oauth2/authorize?client_id=292465938446680064&scope=bot&permissions=8)\n\n[Marcus Lounge](https://discord.gg/RTaDf7q)`, inline: true},
				{name: 'Online', value: `[Twitter](https://twitter.com/discord_marcus)\n[Trello](https://trello.com/b/FocgYQsS/development-board)\n[Patreon](https://www.patreon.com/discordbotmarcus)`, inline: true}
			]}, null, member);
	}
}

module.exports = Command;