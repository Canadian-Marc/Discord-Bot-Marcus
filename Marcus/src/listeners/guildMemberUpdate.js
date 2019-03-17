module.exports = async (client, guild, member) => {
    gs = await client.managers.database.getGuildSettings(guild);

    if(gs.discordlinks) {
        if(member.nick) {
            if(member.nick.includes("discord.gg") || member.nick.includes("discordapp.com/invite")){
                member.edit({nick: "UsernameReset"})
            }
        }
            if(member.user.username.includes("discord.gg") || member.user.username.includes("discordapp.com/invite")){
                member.edit({nick: "UsernameReset"})
                }
    }
    if(gs.httplinks) {
        if(member.nick) {
            if(member.nick.includes("http") || member.nick.includes("https")){
                member.edit({nick: "UsernameReset"})
            }
        }
            if(member.user.username.includes("http") || member.user.username.includes("https")){
                member.edit({nick: "UsernameReset"})
                }
    }
}
