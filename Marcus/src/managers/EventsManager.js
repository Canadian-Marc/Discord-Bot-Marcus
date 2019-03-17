const fs = require('fs');

class EventsManager {
	constructor(client, path) {
		this.client = client;
		this.path = `${__dirname}/../listeners`;

		this.init();
	}

	init() {
		const listeners = fs.readdirSync(this.path);
		listeners.forEach(file => {
			const event = require(`${this.path}/${file}`);
			this.client.on(file.replace('.js', ''), (...args) => event(this.client, ...args));
		});
	}
}

module.exports = EventsManager;
