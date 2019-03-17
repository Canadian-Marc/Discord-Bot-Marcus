const superagent = require('superagent');

class Player {
	constructor(client, guild, feed) {
		this.guild = guild;
		this.client = client;
		this.textChannelID = feed;
		this.nowPlaying = null;
		this.queue = [];
		this.lastMessage = null;
		this.repeat = false;

		this.client.players.set(this.guild.id, this);
	}

	get connection() {
		return this.client.voiceConnections.get(this.guild.id);
	}

	connect(channelID) {
		return this.client.joinVoiceChannel(channelID, { region: this.guild.region });
	}

	disconnect() {
		this.connection.removeAllListeners();
		this.client.leaveVoiceChannel(this.connection.channelId);

		this.client.players.delete(this.guild.id);
		delete this;
	}

	async resolve(query, requester) {

		if(!/^http|(sc|yt)search/.test(query)) query = `ytsearch:${encodeURIComponent(query)}`;
		const isSearch = /^(sc|yt)search/.test(query);
		if(!isSearch) query = encodeURIComponent(query);

		const { body } = await superagent.get(`http://${this.client.config.lavalink.nodes[0].host}:${this.client.config.lavalink.nodes[0].port}/loadtracks?identifier=${query}`)
			.set('Authorization', this.client.config.lavalink.nodes[0].password);

		if(!body || !body.loadType === 'NO_MATCHES') {
			return 'NOT_RESOLVED';
		}
		else if(body.tracks[0] && isSearch) {
		///	if(callback && isSearch) {
		///		return await callback(body.tracks.slice(0, 5).map(track => Object.assign(track.info, { thumbnail: this.getThumbnail(track.info), track: track.track, requester })));
		///	}
		///	else {
				return Object.assign(body.tracks[0].info, { thumbnail: this.getThumbnail(body.tracks[0].info), track: body.tracks[0].track, requester });
		///	}
		}
		else {
			return body.tracks.map(track => Object.assign(track.info, { thumbnail: this.getThumbnail(track.info), track: track.track, requester }));
		}
	}

	async add(item, requester) {
		item = await this.resolve(item, requester);

		if(typeof item === 'string') {
			return item;
		} else if(Array.isArray(item)) {
			this.queue = this.queue.concat(item);
		} else {
			this.queue.push(item);
		}

		return item;
	}

	async play() {
		if(!this.connection || this.connection.playing) return;
		else if(this.connection.paused) this.connection.setPause(false);

		let song = this.queue.shift();
		if(!song && !this.queue.length) {
			this.disconnect();
			return;
		} else if(!song) {
			setTimeout(() => this.play(), 250);
		} else if(!song.track) {
			song = await this.client.resolve(song.uri, song.requester);
		}

		this.nowPlaying = song;
		this.connection.play(song.track);
		this.sendNowPlaying();

		this.connection.once('end', () => {
			if(this.repeat) this.queue.push(this.nowPlaying);
			this.currentSong = null;
			this.voteSkips = 0;
			this.connection.removeAllListeners();
			this.nowPlaying = null;

			this.play();
		});

		this.connection.once('error', () => this.play());
	}

	async sendNowPlaying() {
		if(this.lastMessage) this.lastMessage.delete().catch(err => {}); // eslint-disable-line handle-callback-err, no-empty-function
		this.lastMessage = await this.client.createMessage(this.textChannelID, `Now playing **${this.nowPlaying.title}** (\`${this.nowPlaying.isStream ? 'LIVE' : this.formatDuration(this.nowPlaying.length / 1000)}\`) requested by ${this.nowPlaying.requester}`)
			.catch(err => {}); // eslint-disable-line no-empty-function, handle-callback-err
	}

	getThumbnail(song) {
		const { identifier, uri } = song;
		if(/^(https?:\/\/)?www\.youtube\.com\//.test(uri)) {
			return `https://img.youtube.com/vi/${identifier}/mqdefault.jpg`;
		} else if(/^(https?:\/\/)?twitch\.tv\//.test(uri)) {
			return `https://static-cdn.jtvnw.net/previews-ttv/live_user_${identifier}-320x180.jpg`;
		} else {
			return undefined;
		}
	}

	formatDuration(seconds) {
		const hours = Math.floor(seconds / 3600);
		const mins = Math.floor(seconds % 3600 / 60);
		return `${hours ? `${hours.toString().padStart(2, 0)}:${mins.toString().padStart(2, 0)}` : mins}:` +
			`${Math.floor(seconds % 3600 % 60).toString().padStart(2, 0)}`;
	}

	memberIsListening(member) {
		return this.connection &&
			member.voiceState &&
			!member.voiceState.selfDeaf &&
			!member.voiceState.deaf &&
			member.voiceState.channelID === this.connection.channelId &&
			member.user.id !== this.client.user.id;
	}

	getListeners() {
		return this.guild.channels.get(this.connection.channelId).voiceMembers.filter(mem => this.memberIsListening(mem));
	}
}

module.exports = Player;