const { Command: Base } = require('../../structures');

class Command extends Base {
	constructor(...args) {
		super(...args, {
			description: 'Enables/disables httplinks automoderation.',
			args: [{ type: 'text', label: 'enable | disable | text' }],
			guildOnly: true,
			permission: 'manageGuild',
			examples: ['httplinks enable/disable']
		});
	}

	async run({ reply, args, guild }) {
		if(args[0] === 'disable') {
			await this.client.managers.database.updateGuildSettings(guild, { httplinks: null });
			return reply('``AUTOMOD: Http_Links`` has been disabled.');
        } else if(args[0] === 'enable') {
			await this.client.managers.database.updateGuildSettings(guild, { httplinks: "enabled" });
			return reply('``AUTOMOD: Http_Links`` has been enabled.');
        } else {
			reply('Invalid response. Please respond with ``enable`` or ``disable`` to enable/disable ``AUTOMOD: Http_Links``.'), false;
		}
	}
}

module.exports = Command;