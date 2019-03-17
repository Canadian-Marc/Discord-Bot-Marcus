const { Command: Base } = require('../../structures/');
const superagent = require('superagent');
const cheerio = require('cheerio');
const colours = require('../../util/colours');

class Command extends Base {
	constructor(...args) {
		super(...args, {
			description: 'Gets lyrics for a song',
			args: [{ type: 'text', label: 'title' }]
		});
	}

	async run({ args: [title], member, reply, channel }) {
		let { body: lyricLink } = await superagent.get(`https://api.genius.com/search?q=${title}`)
			.set('Authorization', this.client.config.geniusKey);

		if(lyricLink.response.hits[0] === undefined) {
			reply('No song found', false);
			return;
		}
		let { text: re } = await superagent.get(lyricLink.response.hits[0].result.url);
		if(!re) {
			reply('Unable to get lyric link', false);
			return;
		}
		const html = cheerio.load(re);
		let lyrics = html('div.lyrics').find('p').text();
		let artist = html('h2').find('a').text();
		let song = html('h1.header_with_cover_art-primary_info-title').text();
		let albumart = lyricLink.response.hits[0].result.song_art_image_thumbnail_url;
		let uri = lyricLink.response.hits[0].result.url;

		const texts = this.split(lyrics);

		if(Array.isArray(texts)) {
			texts.forEach(text => {
				channel.createMessage({
					embed: {
						color: colours.botcolour,
						title: `${song} by ${artist}`,
						url: uri,
						thumbnail: { url: albumart },
						description: text
					}
				});
			});
		} else {
			channel.createMessage({
				embed: {
					color: colours.botcolour,
					title: `${song} by ${artist}`,
					url: uri,
					thumbnail: { url: albumart },
					description: texts
				}
			});
		}
	}

	split(text, { maxLength = 1950, char = '\n', prepend = '', append = '' } = {}) {
		if(text.length <= maxLength) return text;
		const splitText = text.split(char);
		if(splitText.length === 1) throw new Error('Message exceeds the max length and contains no split characters.');
		const messages = [''];
		let msg = 0;
		for(let i = 0; i < splitText.length; i++) {
			if(messages[msg].length + splitText[i].length + 1 > maxLength) {
				messages[msg] += append;
				messages.push(prepend);
				msg++;
			}
			messages[msg] += (messages[msg].length > 0 && messages[msg] !== prepend ? char : '') + splitText[i];
		}
		return messages;
	}
}

module.exports = Command;
