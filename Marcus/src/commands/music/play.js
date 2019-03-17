const { Player, Command } = require('../../structures/');

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			description: 'Adds a song to the queue.',
			args: [{ type: 'text', label: 'search' }],
			guildOnly: true
		});
	}
	async run({ args: [query], guild, member, channel, reply }) {
		let voiceChannel, player = this.client.players.get(guild.id);
		if(member.voiceState && member.voiceState.channelID) voiceChannel = guild.channels.get(member.voiceState.channelID);

		if(!voiceChannel) {
			reply('You are not in a voice channel.', false);
			return;
		} else if(!voiceChannel.permissionsOf(this.client.user.id).has('voiceConnect')) {
			reply("I don't have the `voiceConnect` permission", false);
			return;
		} else if(!voiceChannel.permissionsOf(this.client.user.id).has('voiceSpeak')) {
			reply("I don't have the `voiceSpeak` permission.", false);
			return;
		} else if(!player) {
			player = new Player(this.client, guild, channel.id);
		}

		let item = await player.add(query, member.user.username);

		if(typeof item === 'string') {
			if(item === 'NOT_RESOLVED') {
				reply('No results found for that query.', false);
			}
		}

		if(player && !player.connection) await player.connect(voiceChannel.id);
		if(!player.nowPlaying) player.play();

		if(!player.queue.length) {
			return;
		} else if(Array.isArray(item)) {
			reply(`Added \`${item.length}\` items from playlist to the queue.`, true);
			return;
		} else {
			reply(`Added \`${item.title}\` to the queue.`, true);
			return;
		}
	}
};
