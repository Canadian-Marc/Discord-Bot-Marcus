const { Command: Base } = require('../../structures/');

class Command extends Base {
	constructor(...args) {
		super(...args, {
			description: 'Views the song queue.',
			args: [{ type: 'int', label: 'page', min: 0, optional: true }],
			aliases: ["q", "list"],
			guildOnly: true
		});
	}
	async run({ reply, args: [pageNum], guild, author }) {
		let player = this.client.players.get(guild.id);
		if(!player) {
			reply('No music is playing.', false);
			return;
		}

		let queue = [player.nowPlaying, ...player.queue];

		let items = [];
		while(queue.length > 0) items.push(queue.splice(0, 10));
		let pageID = Math.min(Math.max(parseInt(pageNum), 1), items.length) || 1;
		let page = items[pageID - 1];

		reply(`Page ${pageID}/${items.length} (${player.queue.length} items)\n\n${page.map((item, id) => `\`${id + 1}:\` ${id === 0 ? '**' : ''}[${item.title}](${item.uri})${id === 0 ? '**' : ''}`).join('\n')}`, null, author);
	}
}

module.exports = Command;
