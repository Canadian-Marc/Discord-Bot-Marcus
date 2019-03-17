module.exports = async (client, guild, member) => {
    gs = await client.managers.database.getGuildSettings(guild);
      
        let muser = member.user.username
    
    if(gs.discordlinks) {
        if(muser.includes("discord.gg") || muser.includes("discordapp.com/invite")){
            muser = "UsernameResetDueToAdvertising"
        }

    }
    if(gs.httplinks) {
        if(muser.includes("http") || muser.includes("https")){
            member.edit({nick: "UsernameReset"})
            muser = "UsernameResetDueToLinks"
        }

    }

    if((gs.userlog)&&(gs.farewell)) {
        let m = await gs.farewell
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