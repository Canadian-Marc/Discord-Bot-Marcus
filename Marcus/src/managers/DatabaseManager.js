const MongoClient = require('mongodb').MongoClient;

class DatabaseManager {
	constructor(client) {
		this.client = client;

		this.connect();
	}

	async connect() {
		this.mongoClient = await MongoClient.connect(this.client.config.databaseURL, { useNewUrlParser: true });
		this.db = this.mongoClient.db();

		this.db.collection('timedActions').createIndex({ expiresAt: 1 });
		this.db.collection('modlog').createIndex({ guildID: 1 });
	}

	async getGuildSettings(guild) {
		const db = await this.db.collection('guilds').findOne({ _id: guild.id || guild });
		if(!db) return this.getGuildDefaults(guild);
		else return db;
	}

	getGuildDefaults(guild) {
		return {
			_id: guild.id || guild,
			name: guild.name,
			icon: guild.iconURL,
			owner: guild.members && guild.members.get(guild.ownerID) ? guild.members.get(guild.ownerID).user.toJSON() : undefined,
			memberCount: guild.memberCount
		};
	}

	async updateGuildSettings(guild, data) {
		const db = await this.db.collection('guilds').findOne({ _id: guild.id });

		if(!db) {
			await this.db.collection('guilds').insertOne(this.getGuildDefaults(guild));
		}

		await this.db.collection('guilds').updateOne({ _id: guild.id }, { $set: data });
	}

	async getUserSettings(user) {
		const db = await this.db.collection('users').findOne({ _id: user.id || user });

		if(!db) return this.getUserDefaults(user);
		else return db;
	}

	getUserDefaults(user) {
		return {
			_id: user.id || user,
			username: user.username,
			discriminator: user.discriminator,
			donator: false
		};
	}

	async updateUserSettings(user, data) {
		const db = await this.db.collection('users').findOne({ _id: user.id });

		if(!db) {
			await this.db.collection('users').insertOne(this.getUserDefaults(user));
		}

		await this.db.collection('users').updateOne({ _id: user.id }, { $set: data });
	}

	async getUserCurrency(user) {
		const db = await this.db.collection('currency').findOne({ _id: user.id});

		if(!db) return this.getUserCurrencyDefaults(user);
		else return db;
	}

	getUserCurrencyDefaults(user) {
		return {
			_id: user.id,
			currency: 0
		};
	}

	async updateUserCurrency(user, newValue) {
		const db = await this.db.collection('currency').findOne({ _id: user.id });

		if(!db) {
			await this.db.collection('currency').insertOne(this.getUserCurrencyDefaults(user));
		}

		await this.db.collection('currency').updateOne({ _id: user.id }, {$set: { currency: newValue}});
	}

	getCases(guildID) {
		return this.db.collection('modlog').find({ guildID }).toArray();
	}

	getCase(guildID, caseID) {
		return this.db.collection('modlog').findOne({ _id: `${guildID}.${caseID}` });
	}

	updateCase(guildID, caseID, caseData) {
		return this.db.collection('modlog').updateOne({ _id: `${guildID}.${caseID}` }, { $set: caseData });
	}

	createCase(data) {
		return this.db.collection('modlog').insertOne(Object.assign(data,{ _id: `${data.guildID}.${data.caseID}`, guildID: data.guildID, caseID: data.caseID }));
	}
}

module.exports = DatabaseManager;