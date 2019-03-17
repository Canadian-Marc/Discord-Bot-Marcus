const { Command: Base } = require('../../structures/');

class Command extends Base {
	constructor(...args) {
		super(...args, {
			description: 'Kicks a user from the server',
			args: [{ type: 'member' }, { type: 'text', label: 'reason', optional: true }],
			guildOnly: true,
			permission: 'kickMembers',
			examples: ['kick [mention] [reason]']
		});
	}

	async run({ reply, args: [member, reason], member: author, guild }) {
		if(!guild.members.get(this.client.user.id).permission.has('kickMembers')) {
			reply('I do not have permissions to kicks members.', false);
			return;
		}

		if(!member.kickable) {
			reply('I am unable to kick that member, maybe they have the same or a higher role than me.', false);
			return;
		} else if(!member.punishable(author)) {
			reply('You are unable to kick that member, maybe they have the same or a higher role than you.', false);
			return;
		}

		await this.client.managers.moderation.kick({ guild, target: member.user, issuer: author, reason });

		await this.client.kickGuildMember(guild.id, member.id, `[${author.user.username}#${author.user.discriminator}] ${reason || 'no reason provided'}`);
		reply(`Kicked **${member.user.username}#${member.user.discriminator}**.\n**Reason:** ${reason || 'None'}`, true);
		return;
	}
}

module.exports = Command;
