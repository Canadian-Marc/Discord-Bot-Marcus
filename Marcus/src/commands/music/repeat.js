const { Command: Base } = require('../../structures/');

class Command extends Base {
	constructor(...args) {
		super(...args, {
			description: 'Toggles repeat the current song.',
			guildOnly: true
		});
	}

	async run({ reply, guild, message }) {
		let player = this.client.players.get(guild.id);
		if(!player) {
			reply('No music is playing.', false);
			return;
		}
		player.repeat = !player.repeat;
		reply(`Repeat is now ${player.repeat ? 'on' : 'off'}.`, true);
	}
}

module.exports = Command;
