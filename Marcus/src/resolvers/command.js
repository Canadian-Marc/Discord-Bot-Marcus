module.exports = (input, message, client) => {
	let command = client.managers.commands.commands.filter(cmd => cmd.name === input.toLowerCase() || cmd.aliases.indexOf(input.toLowerCase()) !== -1);

	return command[0] || null;
};
