const regex = /<@!?(\d+)>/;

module.exports = async (input, message, client) => {
	let members;
	if(message.channel.guild) members = message.channel.guild.members;
	else members = client.users;

	if(regex.test(input)) {
		let id = input.match(regex)[1];

		return members.get(id);
	}

	let check1 = member => member.username === input || (member.username === input.split('#')[0] && member.discriminator === input.split('#')[1]);
	let check2 = member => { // eslint-disable-line
		return member.username.toLowerCase().includes(input.toLowerCase()) ||
			(member.username.toLowerCase().includes(input.split('#')[0].toLowerCase()) && member.discriminator.includes(input.split('#')[1]));
	};

	return members.get(input) || members.find(check1) || members.find(check2);
};
