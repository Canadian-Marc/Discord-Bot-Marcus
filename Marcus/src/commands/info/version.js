const { Command: Base } = require('../../structures/');
const config = require('../../../config.json');

class Command extends Base {
	constructor(...args) {
		super(...args, {
			description: 'Tells you the version of Marcus.',
			aliases: ['v']
		});
	}

	async run({ reply }) {
		return reply(`Currently running v${config.version}!`);
	}
}

module.exports = Command;
