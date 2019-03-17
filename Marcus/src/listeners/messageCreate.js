let config = require("../../config.json")

async function checks(client, message, command) {
	if(command.category === 'owner' && !~client.config.owners.indexOf(message.author.id)) return false;
	if(command.guildOnly && !message.channel.guild) {
		message.channel.createMessage(`You can only use the **${command.name}** command in servers.`);
		return false;
	}

	if(command.permission && !message.member.permission.has(command.permission)) {
		message.channel.createMessage(`Only users with the **${command.permission}** permission can run this command.`);
		return false;
	}

	if(message.channel.guild && !message.channel.permissionsOf(client.user.id).has('sendMessages')) return false; // stop ugly errors

	return true;
}

module.exports = async (client, message ) => {
    if(message.author.bot) return;
    client.managers.currency.awardMessageCurrency(message.author)
    let prefix;
    if(message.channel.guild){
        message.channel.guild.settings = await client.managers.database.getGuildSettings(message.channel.guild);
        if(message.channel.guild.settings.discordlinks) {
            if(message.content.includes("discord.gg") || message.content.includes("discordapp.com/invite")){
                if(!message.member.permission.has("manageMessages")){
                message.delete()
                return message.channel.createMessage(`<@${message.author.id}>, please do not advertise other Discord servers!`)
                }
            }
        }
        if(message.channel.guild.settings.httplinks) {
            if(message.content.includes("http") || message.content.includes("https")){
                if(!message.member.permission.has("manageMessages")){
                message.delete()
                return message.channel.createMessage(`<@${message.author.id}>, please do not send links!`)
                }
            }
    
        }
        if(message.channel.guild.settings.prefix) {
            let prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${message.channel.guild.settings.prefix})( *)?`);
            let match = message.content.match(prefixRegex);
            if(!match) return;
            prefix = match[0];
        } else {
            let prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${client.config.prefix}${message.channel.guild.settings.prefix ? `|${message.channel.guild.settings.prefix}` : ''})( *)?`);
            let match = message.content.match(prefixRegex);
            if(!match) return;
            prefix = match[0];
        }
    }

    if(!message.channel.guild){
        prefix = config.prefix
    }

    message.content = message.content.substring(prefix.length);
    message.oldContent = message.content;

    let command;
    if(!~message.content.indexOf(' ')) {
        command = message.content;
        message.content = '';
    } else {
        command = message.content.substring(0, message.content.indexOf(' '));
        message.content = message.content.substring(message.content.indexOf(' '));
    }

    if(message.content.startsWith(' ')) message.content = message.content.substring(1);

	command = command.toLowerCase().trim();

	command = client.managers.commands.get(command) || client.managers.commands.find(cmd => cmd.aliases.indexOf(command) !== -1);
	if(!command) return;

	if(await checks(client, message, command)) await client.managers.commands.execute(message, command);
};
