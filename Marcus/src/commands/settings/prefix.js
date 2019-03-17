const { Command: Base } = require('../../structures/');

class Command extends Base {
	constructor(...args) {
		super(...args, {
			description: 'Changes the prefix for this server.',
			args: [{ type: 'text', label: 'prefix' }],
			guildOnly: true,
			permission: 'manageGuild',
			examples: ['prefix [newPrefix]', '[prefix reset]']
		});
	}

	async run({ reply, args, guild }) {
		if(args[0] === 'reset') {
			await this.client.managers.database.updateGuildSettings(guild, { prefix: null });
			reply('Prefix reset.');
        } else {
			await this.client.managers.database.updateGuildSettings(guild, { prefix: args[0] });
			reply('Updated the command prefix.', true);
		}
	}
}

module.exports = Command;
