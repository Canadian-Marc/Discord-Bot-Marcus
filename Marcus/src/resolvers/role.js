module.exports = (input, message) => {
	if(input.match(/<@&(\d{17,21})>/)) input = input.match(/<@&(\d{17,21})>/)[1];
	const foundRole = message.channel.guild.roles
		.find(role => input === role.id || input.toLowerCase() === role.name.toLowerCase());

	if(foundRole) return foundRole;
	else return null;
};
