const { Command: Base } = require('../../structures/');

class Command extends Base {
	constructor(...args) {
		super(...args, {			
        description: 'Grabs the avatar of a person.',
        args: [{ type: 'member', optional: true }],
        });
	}

	async run({ reply, args, member }) {
        let user = args[0] || member;
        await reply.embed({ image: { url: user.avatarURL }, color: reply.colours.botcolour }, user)
	}
}

module.exports = Command;