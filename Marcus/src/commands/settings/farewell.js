const { Command: Base } = require('../../structures/');

class Command extends Base {
	constructor(...args) {
		super(...args, {
			description: 'Sets the farewell message.',
			args: [{ type: 'text', label: 'enable | disable | text' }],
			guildOnly: true,
			permission: 'manageGuild',
			examples: ['farewell [message]', 'farewell disable']
		});
	}

	async run({ reply, args, guild }) {
		if(args[0] === 'disable') {
			await this.client.managers.database.updateGuildSettings(guild, { farewell: null });
			reply('Farewell has been disabled.');
        } else {
			await this.client.managers.database.updateGuildSettings(guild, { farewell: args[0] });
			reply('Farewell has been set.');
		}
	}
}

module.exports = Command;
