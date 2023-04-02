class connBots {
    static async send(channel, content) {
        let guild = verifedBot.guilds.cache.get(sistem.SUNUCU.GUILD)
        let ch = guild.channels.cache.get(channel)
        if(ch) await ch.send(content).catch(err => {});      
    }
}
const { Client, GatewayIntentsBits } = require('discord.js');
const { bgBlue, black, green } = require("chalk");

class safeStart extends Client {
    constructor(...opt) {
        super({
            opt,
            intents: [Intents.Flags.GUILDS,Intents.Flags.GUILD_MESSAGES, Intents.Flags.GUILD_WEBHOOKS],
            fetchAllMembers: true,
        })
        this.login("ODE2MjIxODMwMDI4ODUzMjk4.YD3z0A.IAXl-RqwJ2WStzgy42xlj8pYJuA").then(x => {
            client.logger.log(`${black.bgHex('#D9A384')("VERIFED BOT")} BOT kullanıma aktif edilmiştir.`,"botReady")
        })
        
    }

}

module.exports = { connBots, safeStart }



