const { Command: Base } = require('../../structures');

class Command extends Base {
	constructor(...args) {
		super(...args, {
			description: 'Can deduct currency of any user.',
			args: [{ type: 'member', optional: true}, { type: 'int', label: 'value' }],
			guildOnly: true
		});
	}

	async run({ args, args: [member, value], reply }) {
		let user = args[0] || member;
        	await this.client.managers.currency.deductTotalCurrency(user, value);
        	reply(`Currency value for ${user.mention} has been edited.`, true);
	}
}

module.exports = Command;