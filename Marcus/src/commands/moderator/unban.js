const { Command: Base } = require('../../structures');

class Command extends Base {
	constructor(...args) {
		super(...args, {
			description: 'Unbans a user from the server',
			args: [{ type: 'int'}, { type: 'text', label: 'reason', optional: true }],
			guildOnly: true,
			permission: 'banMembers',
			examples: ['unban [userID] [reason]']
		});
	}

	async run({ args: [int, reason], reply, member: author, guild, }) {
		if(!guild.members.get(this.client.user.id).permission.has('banMembers')) {
			reply('I do not have permissions to unban members.', false);
			return;
		}

		try {
			let u = await this.client.getRESTUser(int)
			await this.client.managers.moderation.unban({ guild, target: u, issuer: author, reason });

			await this.client.unbanGuildMember(guild.id, int,`[${author.username}#${author.discriminator}] ${reason || 'no reason provided'}`);
			return reply(`Unbanned **${u.username}#${u.discriminator}**.\n**Reason:** ${reason || 'None'}`, true);
				} catch(err) {
					console.log(err)
					reply("Invalid user. If this error continues to exist, please seek help in Marcus Lounge.")}
				}
}

module.exports = Command;