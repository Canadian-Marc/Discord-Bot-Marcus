const { Command: Base } = require('../../structures/');
const colours = require('../../util/colours');

class Command extends Base {
	constructor(...args) {
		super(...args, {
			description: 'Views the current song.',
			aliases: ['nowplaying', 'np'],
			guildOnly: true
		});
	}

	async run({ channel, reply, args: [pageNum], guild }) {
		let player = this.client.players.get(guild.id);
		if(!player) {
			reply('No music is playing.', false);
			return;
		}

		channel.createMessage({
			embed: {
				title: player.nowPlaying.title,
				url: player.nowPlaying.uri,
				thumbnail: { url: player.nowPlaying.thumbnail },
				color: colours.botcolour,
				fields: [{
					name: 'Time',
					value: `${player.formatDuration(player.connection.state.position / 1000)}/${player.nowPlaying.isStream ? 'LIVE' : player.formatDuration(player.nowPlaying.length / 1000)}`,
					inline: true
				}, {
					name: 'Requested By',
					value: player.nowPlaying.requester,
					inline: true
				}],
				footer: { text: `Voice node: ${this.client.config.lavalink.nodes.filter(no => no.host === player.connection.node.host)[0].name} (${player.connection.node.region})` }
			}
		});
	}
}

module.exports = Command;
