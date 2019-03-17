const { Command: Base } = require('../../structures/');

class Command extends Base {
	constructor(...args) {
		super(...args, {
			description: 'Seeks to a point in the current song.',
			args: [{ type: 'int', label: 'seconds' }],
			guildOnly: true
		});
	}

	async run({ args: [seconds], member, reply, guild }) {
		let player = this.client.players.get(guild.id);
		if(!player) {
			reply('No music is playing.', false);
			return;
		}
		if(!player.memberIsListening(member)) {
			reply("You're not listening to this song.");
			return;
		}

		if(player.nowPlaying.length / 1000 < seconds) {
			reply(`You can only seek up to ${Math.floor(player.nowPlaying.length / 1000)} seconds.`, false);
			return;
		} else if(player.nowPlaying.isStream) {
			reply("You can't seek into a stream.", false);
			return;
		}

		player.connection.seek(seconds * 1000);
		reply(`Seeked to \`${seconds}\` seconds.`, true);
	}
}

module.exports = Command;
