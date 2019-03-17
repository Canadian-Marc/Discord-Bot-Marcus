const { Command: Base } = require('../../structures/');

class Command extends Base {
	constructor(...args) {
		super(...args, {
			description: 'Evaluates javascript code.',
			args: [{ type: 'text', label: 'code', optional: false }]
		});
	}

	async run({ reply, message, args, member, author, guild, channel, client }) {
		try {
			let start = Date.now();
			let res = await eval(`(async function(){${args[0]}}).call(this)`);
			res = require('util').inspect(res, { depth: 0 })
				.replace(this.client.config.token, '')
				.substring(0, 1900);

			reply(`Success (took ${Math.round(Date.now() - start)}ms)\n\`\`\`js\n${res}\n\`\`\``, true);
		} catch(err) {
			reply(`Error\n\`\`\`js\n${err}\n\`\`\``, false);
		}
	}
}

module.exports = Command;