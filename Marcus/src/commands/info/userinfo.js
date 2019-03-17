const { Command: Base } = require('../../structures');
class Command extends Base {
	constructor(...args) {
		super(...args, {
            description: 'Views server information.',
            args: [{ type: 'member', optional: true }],
            aliases: ["uinfo"],
            examples: ["uinfo", "uinfo [mention]"]
		});
	}

	async run({ reply, message, args: [member]}) {
        let u = message.channel.guild.members.get(message.author.id)
        if(member) u = member

        let n = u.nick
        let b = "User is a bot."
        if(!u.nick) n = "User does not have a nickname."
        if(!u.bot) b = "User is not a bot."

        return await reply.embed({
            author: { name: `${u.user.username}#${u.user.discriminator} (${u.user.id})`, icon_url: u.user.avatarURL}, 
            color: reply.colours.botcolour,
            thumbnail: { url: u.avatarURL },
            fields: [
                {name: `Status`, value: u.status, inline: true },
                {name: `Nickname`, value: n},
                {name: `Game`, value: u.game ? u.game.name : 'User is not playing a game.', inline: true },
                {name: `Bot`, value: b, inline: true},
                {name: `Joined`, value: `${new Date(u.joinedAt)}`, inline: true },
                {name: `Registered`, value: `${new Date(u.user.createdAt)}`, inline: true}
                ]
            })
        }
}
module.exports = Command;