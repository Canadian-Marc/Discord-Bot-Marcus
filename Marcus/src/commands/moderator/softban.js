const { Command: Base } = require('../../structures');

class Command extends Base {
	constructor(...args) {
		super(...args, {
			description: 'Softbans a user from the server',
			args: [{ type: 'member' }, { type: 'text', label: 'reason', optional: true }],
			guildOnly: true,
			permission: 'kickMembers',
			examples: ['softban [mention] [reason]']
		});
	}

	async run({ reply, args: [member, reason], member: author, guild }) {
		if(!guild.members.get(this.client.user.id).permission.has('banMembers')) return reply('I do not have permissions to ban members.', false);
		if(!member.bannable) return reply('I am unable to ban that member, maybe they have the same or a higher role than me.', false);
		if(!member.punishable(author)) return reply('You are unable to ban that member, maybe they have the same or a higher role than you.', false);

		await this.client.managers.moderation.softban({ guild, target: member.user, issuer: author, reason });

		await this.client.banGuildMember(guild.id, member.id, 7, `[${author.user.username}#${author.user.discriminator}] ${reason || 'no reason provided'}`).then(this.client.unbanGuildMember(guild.id, member.id, `[${author.user.username}#${author.user.discriminator}] ${reason || 'no reason provided'}`))
		reply(`Softbanned **${member.user.username}#${member.user.discriminator}**.\n**Reason:** ${reason || 'None'}`, true);
		return;
	}
}

module.exports = Command;
