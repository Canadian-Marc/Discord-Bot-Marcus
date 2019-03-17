const Eris = require('eris-additions')(require('eris'), { enabled: ['Member.kickable', 'Member.bannable', 'User.tag', 'Member.tag'] });
const fs = require('fs');
const { PlayerManager } = require('eris-lavalink');
const config = require('../config.json');
const logger = require('./modules/logger');

class Marcus extends Eris.Client {
	constructor() {
		super(config.token, { maxShards: config.shards, defaultImageSize: 256, disableEvents: { TYPING_START: true }, messageLimit: 0, restMode: true });

		this.logger = logger;
		this.config = config;
		this.players = new Eris.Collection();

		if(!(this.voiceConnections instanceof PlayerManager)) {
			this.voiceConnections = new PlayerManager(this, config.lavalink.nodes, {
				numShards: config.shards,
				userId: config.clientID
			});
		}

		this.managers = {};
	}

	run() {
		const directory = fs.readdirSync(`${__dirname}/managers/`);
		directory.forEach(file => {
			const Manager = require(`${__dirname}/managers/${file}`);
			this.managers[file.replace('.js', '').replace('Manager', '').toLowerCase()] = new Manager(this);
		});

		this.connect();
	}
}

new Marcus().run();

process.on('unhandledRejection', (error) => {
	logger.error('Unhandled Rejection', error.stack || error.message);
});
