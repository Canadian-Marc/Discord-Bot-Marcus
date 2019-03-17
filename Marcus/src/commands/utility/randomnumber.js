const { Command: Base } = require('../../structures');

class Command extends Base {
	constructor(...args) {
		super(...args, {
            description: 'Roll a random number!',
            args: [{ type: 'int', label: 'value', optional: true }],
			aliases: ['roll']
		 });
	}

	async run({ reply, args: [value] }) {
        if (!value) var value = 10

        return reply(`The number you rolled was the number **${Math.floor((Math.random() * value))}**!`)
    }
}
module.exports = Command;