const { Command: Base } = require('../../structures/');
class Command extends Base {
	constructor(...args) {
		super(...args, {
			description: 'Views server information.',
			aliases: ["sinfo"]
		});
	}

	async run({ guild, reply, client}) {
        let o = client.users.get(guild.ownerID)
        let i = "https://discordapp.com/assets/28174a34e77bb5e5310ced9f95cb480b.png"
        if(guild.icon) i = guild.dynamicIconURL("png")

            return reply.embed({
                author: { name: `${guild.name} (${guild.id})`, icon_url: i}, 
                color: reply.colours.botcolour,
                thumbnail: {url: i},
                fields: [
                        {name: `Members`, value: guild.memberCount, inline: true },
		                {name: `Bots`, value: guild.members.filter(m => m.bot).length, inline: true },
                        {name: `Users`, value: guild.members.filter(m => !m.bot).length, inline: true },
                        {name: `Online`, value: guild.members.filter(m => m.status !== "offline").length, inline: true},
                        {name: `Roles`, value: guild.roles.map(r => r.name).length, inline: true},
		                {name: `Region`, value: guild.region, inline: true},
                        {name: `Shard`, value: guild.shard.id, inline: true },
                        {name: `Verification Level`, value: guild.verificationLevel, inline: true},
                        {name: `Owner`, value: `${o.username}#${o.discriminator}`, inline: true },
                        {name: `Created`, value: `${new Date(guild.createdAt)}`, inline: true},
                    ]
            })
        }
}
module.exports = Command;