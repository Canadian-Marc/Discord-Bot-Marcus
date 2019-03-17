class ModerationManager {
	constructor(client) {
		this.client = client;

		this.recent = new Map();
		this.colours = {
			kick: 0xffb260,
			ban: 0xff0000,
			warn: 0xFFFF00,
			tempban: 0xC71585,
			softban: 0xff6060,
			unban: 0x00cc00,
			mute: 0xFFFFFF
		};
	}

	async createMessage(guild, embed) {
		const settings = await this.client.managers.database.getGuildSettings(guild);
		if(!settings.modlog) return undefined;

		return this.client.createMessage(settings.modlog, { embed })
			.then(message => message.id)
			.catch(err => this.client.logger.error('moderationManager', `Case error: ${err}`));
	}

	buildEmbed(data) {
		let embed = {
			color: this.colours[data.action],
			footer: { text: `Case ${data.caseID}` },
			timestamp: new Date()
		};

		let description = `**Action:** ${data.action.charAt(0).toUpperCase() + data.action.substring(1)}\n**User:** ${data.target.username}#${data.target.discriminator} (${data.target.id})`;

		if(data.issuer) {
			embed.author = {
				name: `${data.issuer.username}#${data.issuer.discriminator} (${data.issuer.id})`,
				icon_url: data.issuer.avatarURL
			};
		}

		if(data.reason) {
			description += `\n**Reason:** ${data.reason}`;
		}

		embed.description = description;
		return embed;
	}

	async create(data) {
		data.caseID = (await this.client.managers.database.getCases(data.guild.id)).length + 1;

		const insertData = {
			caseID: data.caseID,
			guildID: data.guild.id,
			_id: `${data.guild.id}.${data.caseID}`,
			action: data.action,
			reason: data.reason,
			issuer: data.issuer ? Object.assign(data.issuer.user.toJSON(), { avatarURL: data.issuer.avatarURL }) : null,
			target: data.target.toJSON(),
			time: data.time
		};

		insertData.msgID = await this.createMessage(data.guild, this.buildEmbed(insertData));
		await this.client.managers.database.createCase(insertData);
		return data.caseID;
	}

	async updateEntry(caseID, data) {
		const entry = await this.client.managers.database.getCase(data.guildID, caseID);

		if(!entry) return 'Invalid case ID.';
		if(!entry.msgID) return 'There is no message for this case.';

		const set = await this.client.managers.database.getGuildSettings(data.guildID);
		if(!set.modlog) return 'Modlog is disabled.';

		entry.issuer = Object.assign(data.issuer.toJSON(), { avatarURL: data.issuer.avatarURL });
		entry.reason = data.reason;
		
		await this.client.editMessage(set.modlog, entry.msgID, { embed: this.buildEmbed(entry) });
		await this.client.managers.database.updateCase(data.guildID, entry.caseID, entry);
		return true;
	}

	async kick({ guild, target, issuer, reason }) {
		await this.create({ action: 'kick', guild, target, issuer, reason });
	}

	async warn({ guild, target, issuer, reason }) {
		await this.create({ action: 'warn', guild, target, issuer, reason });
	}

	async softban({ guild, target, issuer, reason }) {
		await this.create({ action: 'softban', guild, target, issuer, reason });
	}

	async ban({ guild, target, issuer, reason, time }) {
		if(this.recent.get(`ban:${guild.id}-${target.id}`)) return;

		const caseID = await this.create({ action: time ? 'tempban' : 'ban', guild, target, issuer, reason, time });

		this.recent.set(`ban:${guild.id}-${target.id}`, caseID);
		setTimeout(() => this.recent.delete(`ban:${guild.id}-${target.id}`), 30000);
	}

	async unban({ target, guild, issuer, reason }) {
		if(this.recent.has(`ban:${guild.id}-${target.id}`)) {
			this.updateEntry(this.recent.get(`ban:${guild.id}-${target.id}`), { action: 'unban', guild, target, issuer, reason });
			this.recent.delete(`ban:${guild.id}-${target.id}`);
		} else {
			await this.create({ action: 'unban', guild, target, issuer, reason });
		}
	}

	async mute({ time, guild, issuer, target, reason, role }) {
		if(this.recent.get(`mute:${guild.id}-${target.id}`)) return;

		if(time) await this.client.managers.database.createTimedAction({ expiresAt: Date.now() + time, type: 'tempmute', userID: target.id, guildID: guild.id, roleID: role.id });

		const caseID = await this.create({ action: time ? 'tempmute' : 'mute', guild, target, issuer, reason, time, role });

		this.recent.set(`mute:${guild.id}-${target.id}`, caseID);
		setTimeout(() => this.recent.delete(`mute:${guild.id}-${target.id}`), 10000);
	}

	async unmute({ guild, target, issuer, reason, role }) {
		if(this.recent.has(`unmute:${guild.id}-${target.id}`)) return;

		const caseID = await this.create({ action: 'unmute', guild, target, issuer, reason, role });

		this.recent.set(`unmute:${guild.id}-${target.id}`, caseID);
		setTimeout(() => this.recent.delete(`unmute:${guild.id}-${target.id}`), 10000);
	}
}

module.exports = ModerationManager;