const { Command: Base } = require('../../structures/');

class Command extends Base {
	constructor(...args) {
		super(...args, {
			description: 'Pauses the current song.',
			permission: 'voiceMoveMembers',
			guildOnly: true
		});
	}

	async run({ reply, client, guild, member }) {
		let player = client.players.get(guild.id);
		if(!player || !player.nowPlaying) {
			reply('No music is playing.', false);
			return;
		}
		if(!player.memberIsListening(member)) {
			reply("You're not listening to this song.", false);
			return;
		}

		player.connection.setPause(true);

		reply('Paused the player.', true);
	}
}

module.exports = Command;
