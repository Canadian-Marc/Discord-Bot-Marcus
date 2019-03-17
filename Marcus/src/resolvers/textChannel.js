module.exports = (input, message) => {
	if(input.match(/<#(\d{17,21})>/)) input = input.match(/<#(\d{17,21})>/)[1];
	const foundChannel = message.channel.guild.channels
		.filter(ch => ch.type === 0)
		.find(ch => input === ch.id || input.toLowerCase() === ch.name.toLowerCase());

	return foundChannel;
};
