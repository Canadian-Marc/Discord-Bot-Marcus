const { Command: Base } = require('../../structures/');

class Command extends Base {
	constructor(...args) {
		super(...args, {			
        description: 'Answers all your questions.',
        args: [{ type: 'text', label: 'question' }]
        });
	}

	async run({ reply }) {
        const answers = ["Very certain.", "It is so.", "Of course!", "Of course not!", "Without a doubt!",
        "Yes, definitely.", "You may rely on it!", "As I see it, yes!", "Most likely!", "Outlook is good!",
        "Yes!", "Signs point to yes!", "Ask again later.", "Don't count on it!", "My reply is no.",
        "My sources say no.", "Outlook not so good!", "Very doubtful."];

        var result = Math.floor((Math.random() * answers.length) + 0)

        await reply(answers[result]);

	}
}

module.exports = Command;