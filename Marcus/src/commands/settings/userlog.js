const { Command: Base } = require('../../structures');

class Command extends Base {
	constructor(...args) {
		super(...args, {
			description: 'Enables or disables the moderation log.',
			args: [{ type: 'text', label: 'enable | disable' }, { type: 'textChannel', optional: true }],
			guildOnly: true,
			permission: 'manageGuild',
			examples: ['userlog enable [channel]', 'userlog disable']
		});
	}

	async run({ reply, args, guild }) {
		if(args[0] === 'disable') {
			await this.client.managers.database.updateGuildSettings(guild, { userlog: null });
			reply('User log channel has been disabled.');
		} else if(args[0] === 'enable' && !args[1]) {
			reply('Missing `channel` argument.', false);
		} else if(args[0] !== 'enable'){
			reply('Missing `text (enable/disable)` argument.')
		} else {
			await this.client.managers.database.updateGuildSettings(guild, { userlog: args[1].id });
			reply('User log channel has been enabled.');
		}
	}
}

module.exports = Command;
