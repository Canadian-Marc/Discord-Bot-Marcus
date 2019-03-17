const { Command: Base } = require('../../structures');

class Command extends Base {
	constructor(...args) {
		super(...args, {
			description: 'Purges up to the last 100 messages in a channel or of a user. Cannot delete messages over 2 weeks old.',
			args: [{ type: 'int', label: 'value' }, {type: 'member', label: 'user', optional: true }],
            aliases: ['prune'],
            guildOnly: true,
            permission: 'manageMessages',
            examples: ['purge [number]', 'purge [number] [mention]']
		});
	}

	async run({ args: [value, user], reply, message, client }) {
        if(value > 100) value = 100

        if(user) {
            message.channel.getMessages().then((msgs) => {
                msgs = msgs.filter(m => m.author.id == user.id)
                    var m = msgs.slice(0, value).map(m => m.id)
                        message.channel.deleteMessages(m)
                })
            return reply(`Purged ${value} messages.`);
        }

        message.delete()
        client.purgeChannel(message.channel.id, `${value}`)
        return reply(`Purged ${value} messages.`).then(msg => setTimeout(() => msg.delete(), 5000));
    }
}

module.exports = Command;
