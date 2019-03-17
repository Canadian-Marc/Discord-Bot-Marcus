const { Command: Base } = require('../../structures/');

class Command extends Base {
	constructor(...args) {
		super(...args, {
			description: 'Shuffles the queue.',
			permission: 'voiceMoveMembers',
			guildOnly: true
		});
	}

	async run({ reply, guild, member }) {
		let player = this.client.players.get(guild.id);
		if(!player || !player.nowPlaying) {
			reply('No music is playing', false);
			return;
		}
		if(!player.memberIsListening(member)) {
			reply("You're not listening to this song.", false);
			return;
		}
		for(let i = player.queue.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[player.queue[i], player.queue[j]] = [player.queue[j], player.queue[i]];
		}

		reply('', true);
	}
}

module.exports = Command;
