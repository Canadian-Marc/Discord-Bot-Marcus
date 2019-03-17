module.exports = async (client, guild, member) => {
    gs = await client.managers.database.getGuildSettings(guild);

    if(gs.joinrole) guild.addMemberRole(member.id, gs.joinrole, "Joinrole")
        
        let muser = member.user.username
    
    if(gs.discordlinks) {
        if(muser.includes("discord.gg") || muser.includes("discordapp.com/invite")){
            member.edit({nick: "UsernameReset"})
            muser = "UsernameResetDueToAdvertising"
        }

    }
    if(gs.httplinks) {
        if(muser.includes("http") || muser.includes("https")){
            member.edit({nick: "UsernameReset"})
            muser = "UsernameResetDueToLinks"
        }

    }

    if((gs.userlog)&&(gs.greeting)) {
        let m = await gs.greeting
            m = await m.replace(/{{mention}}/g, member.user.mention)
                .replace(/{{username}}/g, muser)
                .replace(/{{discrim(inator)?}}/g, member.user.discriminator)
                .replace(/{{id}}/g, member.user.id)
                .replace(/{{guild}}/g, guild.name)
                .replace(/{{membercount}}/g, guild.memberCount)
                .replace(/{{tag}}/g, `${muser}#${member.user.discriminator}`)
                
            client.createMessage(gs.userlog, m)
    }
}
