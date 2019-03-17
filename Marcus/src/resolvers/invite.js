module.exports = async (input, message) => {
	const match = input.match(/discord(?:\.gg|app\.com\/invite)\/([a-z0-9-_]{2,16})$/i);
	if(match) [, input] = match;

	try {
		return await (message.channel.guild ? message.channel.guild.shard.client : message.channel._client)
			.getInvite(input, true);
	} catch(err) {
		return undefined;
	}
};
