module.exports = async (client, message) => {
    if(message.channel.id == "414821242038648833") return;
if(message.channel.guild) {
    gs = await client.managers.database.getGuildSettings(message.channel.guild);
    if(!message.content) return

    if(gs.discordlinks) {
        if(message.content.includes("discord.gg") || message.content.includes("discordapp.com/invite")){
            if(!message.member.permission.has("manageMessages")){
            message.delete()
            return message.channel.createMessage(`<@${message.author.id}>, please do not advertise other Discord servers!`)
            }
        }
    }
    if(gs.httplinks) {
        if(message.content.includes("http") || message.content.includes("https")){
            if(!message.member.permission.has("manageMessages")){
            message.delete()
            return message.channel.createMessage(`<@${message.author.id}>, please do not send links!`)
            }}
        }
    }
}