const { Command: Base } = require('../../structures/');

class Command extends Base {
	constructor(...args) {
		super(...args, {
			description: 'Sets the reason for one or more cases.',
			args: [{ type: 'int', label: 'caseID' }, { type: 'text', label: 'reason' }],
			permission: 'kickMembers',
			guildOnly: true,
			examples: ['reason [caseID] [reason]']
		});
	}

	async run({ guild, reply, args: [caseID, reason], author }) {
		const res = await this.client.managers.moderation.updateEntry(caseID, { guildID: guild.id, issuer: author, reason });
		if(typeof res === 'string') reply(`Unable to edit case. (\`${res}\`)`, false);
		else reply('', true);
	}
}

module.exports = Command;
