const { Command: Base } = require('../../structures');
class Command extends Base {
	constructor(...args) {
		super(...args, {
			description: 'Views bot information.',
			aliases: ["botstats"]
		});
	}

    async run({ reply, client}) {
        const moment = require('moment')
            require("moment-duration-format");

        function bytesToSize(bytes) {
            let sizes = ["Bytes", "KB", "MB", "GB", "TB"];
            if(bytes === 0) return "n/a";
            let by = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
            if(by === 0) return `${bytes} ${sizes[by]}`;
            return `${(bytes / Math.pow(1024, by)).toFixed(1)} ${sizes[by]}`;
        }
            return reply.embed({
                author: { name: `${client.user.username}#${client.user.discriminator}`, icon_url: client.user.dynamicAvatarURL("png")}, 
                color: reply.colours.botcolour,
                fields: [
                    {name: `Guilds`, value: client.guilds.size, inline: true },
                    {name: `Channels`, value: Object.keys(client.channelGuildMap).length, inline: true },
                    {name: `Users`, value: [...client.guilds.values()].reduce((p, v) => v.memberCount + p, 0), inline: true },
                    {name: `Shards`, value: client.shards.size, inline: true},
                    {name: `Uptime`, value: moment.duration(client.uptime).format("D[d] H[h] m[m] s[s]"), inline: true },
                    {name: `RAM`, value: bytesToSize(process.memoryUsage().heapUsed), inline: true },
                    {name: `Players`, value: client.players.size, inline: true}
                    ]
            })
        }
}
module.exports = Command;