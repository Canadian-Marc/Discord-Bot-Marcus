const { Command: Base } = require('../../structures');

class Command extends Base {
	constructor(...args) {
		super(...args, {
			description: 'Warns a user.',
			args: [{ type: 'member' }, { type: 'text', label: 'reason', optional: true }],
			guildOnly: true,
			permission: 'kickMembers',
			examples: ['warn [mention] [reason]']
		});
	}

	async run({ reply, args: [member, reason], member: author, guild }) {

		if(!member.kickable) {
			reply('I am unable to warn that member, maybe they have the same or a higher role than me.', false);
			return;
		} else if(!member.punishable(author)) {
			reply('You are unable to warn that member, maybe they have the same or a higher role than you.', false);
			return;
		}

		await this.client.managers.moderation.warn({ guild, target: member.user, issuer: author, reason });

		let dm = await member.user.getDMChannel();
		dm.createMessage(`You have been warned by ${author.username}#${author.discriminator} for ${reason}.`)
		
		reply(`Warned **${member.user.username}#${member.user.discriminator}**.\n**Reason:** ${reason || 'None'}`, true);
		return;
	}
}

module.exports = Command;
