const { Command: Base } = require('../../structures');
const config = require('../../../config.json');

class Command extends Base {
	constructor(...args) {
		super(...args, {
			description: 'Top 20 servers by membercount.',
			aliases: ['top20servers']
		});
	}

	async run({ reply, client, author }) {
		return reply.embed({
			author: { name: `${author.username}#${author.discriminator}`, icon_url: author.avatarURL}, 
			color: reply.colours.botcolour,
			description: `${client.guilds.map(g => g).sort((a, b) => b.memberCount - a.memberCount).splice(0, 20).map(g => `${g.name} - ${g.memberCount} members`).join("\n")}`,
			footer: { text: "Top 20 Servers by Membercount" }
		})
	}
}

module.exports = Command;