const { Command: Base } = require('../../structures/');

class Command extends Base {
	constructor(...args) {
		super(...args, {
			description: 'Skips to the next song.',
			permission: 'voiceMoveMembers',
			guildOnly: true
		});
	}

	async run({ guild, member, reply }) {
		let player = this.client.players.get(guild.id);
		if(!player || !player.nowPlaying) {
			reply('No music is playing.', false);
			return;
		}
		if(!player.memberIsListening(member)) {
			reply("You're not listening to this song.", false);
			return;
		}

		const [next] = player.queue;
		player.connection.stop();
		if(next) reply(`Skipping to \`${next.title}\``, true);
		else reply('Skipped, no music is left in the queue.', true);
	}
}

module.exports = Command;
