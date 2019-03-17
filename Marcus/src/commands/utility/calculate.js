const { Command: Base } = require('../../structures/');
const mathjs = require('mathjs')

class Command extends Base {
	constructor(...args) {
		super(...args, {			
        description: 'Evaluates mathematical expressions.',
        args: [{ type: 'text', label: 'expression' }],
        aliases: ['solve','math']
        });
	}

	async run({ reply, args: [expression] }) {
        await reply(`The answer to your mathematical expression is \`${mathjs.eval(expression)}\`.`);

	}
}

module.exports = Command;