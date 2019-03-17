const { Command: Base } = require('../../structures/');

class Command extends Base {
	constructor(...args) {
		super(...args, {
			description: 'Sets the joinrole.',
			args: [{type: 'text', label: 'enable | disable'}, { type: 'text', label: 'joinrole', optional: true}],
			guildOnly: true,
			permission: 'manageGuild',
			examples: ['joinrole [enable/disable] [rolename]', 'joinrole disable']
		});
	}

	async run({ reply, args, guild }) {
		if(args[0] === 'disable') {
			await this.client.managers.database.updateGuildSettings(guild, { joinrole: null });
			reply('Joinrole has been disabled.');
        } else {
            let r = await guild.roles.find(r => r.name === args[1])
            if(!r) return reply('Invalid role.')
            await this.client.managers.database.updateGuildSettings(guild, { joinrole: r.id });
			reply('Joinrole has been set.');
		}
	}
}

module.exports = Command;
