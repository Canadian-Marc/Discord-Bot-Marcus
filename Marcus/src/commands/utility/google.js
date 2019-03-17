const { Command: Base } = require('../../structures/');
const superagent = require('superagent')

class Command extends Base {
	constructor(...args) {
		super(...args, {			
        description: 'Searches on google!',
        args: [{ type: 'text', label: 'query' }],
        aliases: ['search']
        });
	}

	async run({ reply, args: [query], member }) {
        let { body: { items } } = await superagent.get(`https://www.googleapis.com/customsearch/v1?key=AIzaSyCelXkQfAXmnS1-RrVA-NsBZCiD8EVZmGY&q=${query}&safe=high&cx=007734837863530680667:hpjacaw2au0`); // eslint-disable-line max-len
		if(!items) return await reply("No results.");
        
        await reply.embed({ description: `[**${items[0].title}**](${items[0].link})\n\n${items[0].snippet}` , color: reply.colours.botcolour}, null, member)

	}
}

module.exports = Command;