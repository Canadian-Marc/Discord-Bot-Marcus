const emojis = require('./emojis');
const colours = require('./colours');

module.exports = message => {
	const reply = (content, success = null, author = null) => {
		let final = content;
		let colour;

		if(success === true) {
			final = `${emojis.check} ${content}`;
			colour = colours.green;
		} else if(success === false) {
			final = `${emojis.xmark} ${content}`;
			colour = colours.red;
		} else if(success === 'loading') {
			final = `${emojis.loading} ${content}`;
			colour = colours.botcolour;
		} else {
			final = content;
			colour = colours.botcolour;
		}

		if(author) {
			final = {
				description: final,
				color: colour,
				author: { name: author.user ? author.user.username : author.username, icon_url: author.user ? author.user.avatarURL : author.avatarURL }
			};
		}

		return message.channel.createMessage(typeof final === 'object' ? { embed: final } : final)
			.then(msg => msg)
			.catch(err => {}); // eslint-disable-line no-empty-function, handle-callback-err
	};

	reply.emojis = emojis;
	reply.colours = colours;

	reply.embed = (data, success = null, author = null) => {
		let description = data.description || '';
		let colour;
		let embed = {};

		if(success === true) {
			description = `${emojis.check} ${description}`;
			colour = colours.green;
		} else if(success === false) {
			description = `${emojis.xmark} ${description}`;
			colour = colours.red;
		} else {
			colour = colours.botcolour;
		}

		data.color = colour;
		data.description = description;

		Object.assign(embed, data);

		if(author) {
			embed.author = {
				name: author.user ? author.user.username : author.username,
				icon_url: author.user ? author.user.avatarURL : author.avatarURL
			};
		}

		return message.channel.createMessage({ embed })
			.then(msg => msg)
			.catch(err => {}); // eslint-disable-line no-empty-function, handle-callback-err
	};

	return reply;
};
