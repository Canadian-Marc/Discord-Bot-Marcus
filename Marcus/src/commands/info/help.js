const { Command: Base } = require('../../structures/');
const colours = require('../../util/colours');

class Command extends Base {
	constructor(...args) {
		super(...args, {
			description: 'Views information on a command or lists all commands.',
			args: [{ type: 'command', optional: true }],
			aliases: ["commands", "cmds"],
			examples: ['help', 'help ping']
		});
	}

	async run({ channel, args, reply, author }) {
		if(!args[0]) {
			let categories = {};
			let message = `Use \`${this.client.config.prefix}help command\` for information on a command.\nJoin [Marcus Lounge](https://discord.gg/RTaDf7q) for help!`;
			let fields = [];

			this.client.managers.commands.getAll().forEach(command => {
				if(command.category !== 'owner') {
					if(!categories[command.category]) categories[command.category] = [];
					categories[command.category].push(command.name);
				}
			});

			for(let category in categories) {
				categories[category].sort();
				fields.push({ name: category.charAt(0).toUpperCase() + category.substring(1), value: categories[category].join(', '), inline: false });
			}

			channel.createMessage({
				embed: {
					description: message,
					fields,
					color: colours.botcolour,
					author: { name: author.username, icon_url: author.avatarURL },
					footer: { text: `${this.client.managers.commands.getAll().size} commands` }
				}
			});
		} else {
			reply.embed({
				author: { name: author.username, icon_url: author.avatarURL },
				title: args[0].name,
				color: colours.botcolour,
				description: `${args[0].description}\nUsage: \`${args[0].examples}\`\n\nPermission: ${args[0].permission || 'None'}\nCategory: ${args[0].category}`
			}, null);
		}
	}
}

module.exports = Command;