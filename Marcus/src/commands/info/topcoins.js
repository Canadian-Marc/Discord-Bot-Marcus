const { Command: Base } = require('../../structures');
const config = require('../../../config.json');

class Command extends Base {
	constructor(...args) {
		super(...args, {
			description: 'Top 20 users by coins.',
			aliases: ['top20coins']
		});
	}

	async run({ reply, client, author }) {
        var c = await this.client.managers.database.db.collection('currency').find().toArray()
		return reply.embed({
			author: { name: `${author.username}#${author.discriminator}`, icon_url: author.avatarURL}, 
			color: reply.colours.botcolour,
			description: `${c.map(c => c).sort((a, b) => b.currency - a.currency).splice(0, 20).map(c => `${client.users.get(c._id) ? `${client.users.get(c._id).username}#${client.users.get(c._id).discriminator}` : "Unknown User" } - ${c.currency} coins`).join("\n")}`,
			footer: { text: "Top 20 Users by Coins" }
		})
	}
}

module.exports = Command;