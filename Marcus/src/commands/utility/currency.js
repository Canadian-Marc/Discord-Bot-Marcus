const { Command: Base } = require('../../structures/');

class Command extends Base {
	constructor(...args) {
		super(...args, {			
        description: 'Checks your balance or the balance of others.',
        args: [{ type: 'member', optional: true }],
        aliases: ['money', 'coins']
        });
	}

        async run({ args, reply, member }) {
        let user = args[0] || member;
        
        let currencyDB = await this.client.managers.database.getUserCurrency(user)
        await reply(`💰 ${user.mention} has a total of ${currencyDB.currency} coins. 💰`);

	}
}

module.exports = Command;