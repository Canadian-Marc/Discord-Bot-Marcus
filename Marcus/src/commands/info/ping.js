const { Command: Base } = require('../../structures/');

class Command extends Base {
	constructor(...args) {
		super(...args, { description: 'Simple ping command.' });
	}

	async run({ reply, client, guild }) {
		let before = Date.now();
		let msg = await reply('Pong! HTTPS: `...ms` | WS: `...ms`');

		msg.edit(`Pong! HTTPS: \`${Date.now() - before}ms\` | WS: \`${guild ? guild.shard.latency : client.shards.random().latency}ms\``);
	}
}

module.exports = Command;
