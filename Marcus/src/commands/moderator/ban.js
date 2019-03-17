const { Command: Base } = require('../../structures/');

class Command extends Base {
	constructor(...args) {
		super(...args, {
			description: 'Bans a user from the server',
			args: [{ type: 'member' }, { type: 'text', label: 'reason', optional: true }],
			guildOnly: true,
			permission: 'banMembers',
			examples: ['ban [mention] [reason]']
		});
	}

	async run({ reply, args: [member, reason], member: author, guild }) {
		if(!guild.members.get(this.client.user.id).permission.has('banMembers')) {
			reply('I do not have permissions to ban members.', false);
			return;
		}

		if(!member.bannable) {
			reply('I am unable to ban that member, maybe they have the same or a higher role than me.', false);
			return;
		} else if(!member.punishable(author)) {
			reply('You are unable to ban that member, maybe they have the same or a higher role than you.', false);
			return;
		}

		await this.client.managers.moderation.ban({ guild, target: member.user, issuer: author, reason });

		await this.client.banGuildMember(guild.id, member.id, 7, `[${author.user.username}#${author.user.discriminator}] ${reason || 'no reason provided'}`);
		reply(`Banned **${member.user.username}#${member.user.discriminator}**.\n**Reason:** ${reason || 'None'}`, true);
		return;
	}
}

module.exports = Command;
