const { Command: Base } = require('../../structures/');

class Command extends Base {
	constructor(...args) {
		super(...args, {
			description: 'Sets the greeting message.',
			args: [{ type: 'text', label: 'enable | disable | text' }],
			guildOnly: true,
			permission: 'manageGuild',
			examples: ['greeting [message]', 'greeting disable']
		});
	}

	async run({ reply, args, guild }) {
		if(args[0] === 'disable') {
			await this.client.managers.database.updateGuildSettings(guild, { greeting: null });
			reply('Greeting has been disabled.');
        } else {
			await this.client.managers.database.updateGuildSettings(guild, { greeting: args[0] });
			reply('Greeting has been set.');
		}
	}
}

module.exports = Command;
