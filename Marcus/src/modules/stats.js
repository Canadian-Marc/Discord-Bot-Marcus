const moment = require("moment");
const superagent = require("superagent")
require("moment-duration-format");
const config = require("../../config.json")
const colours = require("../util/colours.json")

module.exports = (client) => {
	function bytesToSize(bytes) {
		let sizes = ["Bytes", "KB", "MB", "GB", "TB"];
		if(bytes === 0) return "n/a";
		let by = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
		if(by === 0) return `${bytes} ${sizes[by]}`;
		return `${(bytes / Math.pow(1024, by)).toFixed(1)} ${sizes[by]}`;
	}

    function getEmbed() {
        return {
        color: colours.botcolour,
        author: {name: `${client.user.username} Status`, icon_url: client.user.dynamicAvatarURL("png")}, // eslint-disable-line camelcase
        fields: [
            {name: `Guilds`, value: client.guilds.size, inline: true },
            {name: `Channels`, value: Object.keys(client.channelGuildMap).length, inline: true },
            {name: `Users`, value: [...client.guilds.values()].reduce((p, v) => v.memberCount + p, 0), inline: true },
            {name: `Shards`, value: client.shards.size, inline: true},
            {name: `Uptime`, value: moment.duration(client.uptime).format("D[d] H[h] m[m] s[s]"), inline: true },
            {name: `RAM`, value: bytesToSize(process.memoryUsage().heapUsed), inline: true },
            {name: `Players`, value: client.players.size, inline: true}
            ],
        timestamp: new Date(),
        footer: { text: `Marcus v${config.version}` }
        }
    }

    function errorOut(actionCause, restartProgram) {
        console.log('Failed to ' + actionCause + ' message')
        if (restartProgram) {
            runProgram()
        }
    }
   
    function deleteMessages(msgs) {
        msgs.forEach(msg => {
            if(msg.author.id === client.user.id) {
                let promise = msg.delete()
                promise.then(function() { }, function() { errorOut('delete', false)})
            }
        })
        createNewMessage()
    }

    function createNewMessage() {
        var statusMessage = client.createMessage("414821242038648833", {
            embed: getEmbed()
        })
        statusMessage.then(editMessageUntilFailure, function() { errorOut('create', true) })  
    }

    function editMessageUntilFailure(msg) {
		superagent.post(`https://discordbots.org/api/bots/stats`)
		.set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjI5MjA3MDk0ODMxODc0MDQ4MSIsImJvdCI6dHJ1ZSwiaWF0IjoxNTMwNjkxODczfQ.o6ow6QuLXOF5V7gf1IZkFGuIFu29nWaj4juSWqqXoeU')
		.send({ server_count: client.guilds && client.guilds.size ? client.guilds.size : (client.Guilds ? client.Guilds.size : Object.keys(client.Servers).length) })
		.catch(console.error);

		superagent.post(`https://discord.bots.gg/api/v1/bots/${client.user.id}/stats`)
		.set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGkiOnRydWUsImlkIjoiMTM1NDkxMzg2NTMwMDcwNTI4IiwiaWF0IjoxNTQ0MzM0NTU2fQ.IWUYLw_Swu9SWNDwA6JF8o4TCKLwgh_D9wToGC6MemY')
		.send({server_count: client.guilds.size})
		.catch(console.error);

		superagent.post(`https://discordsbestbots.xyz/api/bots/${client.user.id}`)
		.set('Authorization', 'fdbd404f32033475640eab783df1966bdaf4be9f')
		.send({guilds: client.guilds.size})
		.catch(console.error);

		superagent.post(`https://discordbotlist.com/api/bots/${client.user.id}/stats`)
		.set('Authorization', 'Bot 4bd00189cca2df5ac4c494756a118f23182b49ce13dd748c64f7ea52be0a5353')
		.send({guilds: client.guilds.size})
		.catch(console.error);
        let newStatus = msg.edit({
            embed: getEmbed()
        })
        newStatus.then(function() { setTimeout(function() { editMessageUntilFailure(msg) }, 17000) }, function() { errorOut('edit', true) })
    }

    function runProgram() {
        var messages = client.getMessages('414821242038648833')
        messages.then(deleteMessages, function() { errorOut('get', true) })
    }
    runProgram()
    
}