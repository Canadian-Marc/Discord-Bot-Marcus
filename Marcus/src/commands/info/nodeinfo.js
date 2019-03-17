const { Command: Base } = require('../../structures/');
const colours = require('../../util/colours');

class Command extends Base {
	constructor(...args) {
		super(...args, {
			description: 'Views a list of voice nodes.',
			aliases: ['nodes']
		});
	}

	run({ reply, author }) {
		const embed = {
			author: { name: author.username, icon_url: author.avatarURL },
			color: colours.botcolour,
			fields: []
		};

		if(!this.client.voiceConnections.nodes) {
			reply.error('No voice nodes connected.');
			return;
		}
		for(const node of this.client.voiceConnections.nodes.values()) {
			const name = this.client.config.lavalink.nodes.filter(no => no.host === node.host)[0].name;
			const stats = node.stats;

			if(!node.connected || !node.stats || !node.ws) {
				embed.fields.push({ name, value: 'Offline', inline: true });
				continue;
			}

			embed.fields.push({
				name: `${name} (${stats.cpu.cores}C)`,
				color: colours.botcolour,
				value: `Players: ${stats.playingPlayers}/${stats.players.toLocaleString()}\nCPU: ${(stats.cpu.systemLoad * 100).toFixed(2)}%`,
				inline: true
			});
		}

		reply(embed);
	}
}

module.exports = Command;