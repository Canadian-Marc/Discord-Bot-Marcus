const fs = require('fs');
const { Collection } = require('eris');

class CommandsManager {
	constructor(client) {
		this.client = client;
		this.path = `${__dirname}/../commands`;
		this.commands = new Collection();
		this.init();
	}
	get(name) {
		return this.commands.get(name);
	}
	getAll() {
		return this.commands;
	}
	find(filter) {
		return this.commands.find(filter);
	}

	init() {
		const categories = fs.readdirSync(this.path);
		categories.forEach(category => {
			const commands = fs.readdirSync(`${this.path}/${category}`);
			commands.forEach(file => {
				if(file.endsWith('.js')) {
					const Command = require(`${this.path}/${category}/${file}`);
					this.commands.set(file.replace('.js', ''), new Command(this.client, file.replace('.js', ''), category));
				}
			});
		});
	}

	async execute(message, command) {
		const reply = message.reply = require('../util/reply')(message);
		const args = await this.client.managers.arguments.resolve(message, command);
		if(args === false) return;

		try {
			await command.run({
				message,
				reply,
				args: args.args,
				member: message.member,
				author: message.author,
				guild: message.channel.guild,
				channel: message.channel,
				client: this.client
			});
		} catch(err) {
			reply('An error occurred, please try again later.', false, message.author);
			this.client.logger.error('commandsManager', `Unable to execute ${command.name}: ${err.stack}`);
		}
	}
}
module.exports = CommandsManager;