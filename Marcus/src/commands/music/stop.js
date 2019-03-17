const { Command: Base } = require('../../structures/');

class Command extends Base {
	constructor(...args) {
		super(...args, {
			description: 'Erases the queue and disconnects.',
			permission: 'voiceMoveMembers',
			aliases: ['end'],
			guildOnly: true
		});
	}

	async run({ reply, guild, member }) {
		let player = this.client.players.get(guild.id);
		if(!player || !player.nowPlaying) {
			reply('No music is playing.', false);
			return;
		}
		if(!player.memberIsListening(member)) {
			reply("You're not listening to this song.", false);
			return;
		}

		player.disconnect();
		reply('Stopped the player.', true);
	}
}

module.exports = Command;
