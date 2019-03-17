const { Command: Base } = require('../../structures');

class Command extends Base {
	constructor(...args) {
		super(...args, {
			description: 'Can add currency of any user.',
			args: [{ type: 'member' }, { type: 'int', label: 'value' }],
			guildOnly: true
		});
	}

	async run({ args, args: [member, value], reply }) {
		let user = args[0] || member;
        	await this.client.managers.currency.addTotalCurrency(user, value);
        	reply(`Currency value for ${user.mention} has been edited.`, true);
	}
}

module.exports = Command;