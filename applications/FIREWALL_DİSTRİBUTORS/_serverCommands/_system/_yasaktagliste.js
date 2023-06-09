const { Client, Message, Util, EmbedBuilder } = require("discord.js");
const Punitives = require('../../../../database/Schemas/Global.Punitives')
const Users = require('../../../../database/Schemas/Client.Users')
const GUILDS_SETTINGS = require('../../../../database/Schemas/Global.Guild.Settings')
const { cartelEmbed } = require('../../../../base/Reference/Embed')
module.exports = {
    Isim: "yasak-tag",
    Komut: ["yasaklı-tag","yasaktag","yasaklıtag","yasaklıtaglar","yasaktaglar","yasaklı-taglar"],
    Kullanim: "",
    Aciklama: "",
    Kategori: "-",
    Extend: true,
    
   /**
   * @param {Client} client 
   */
  onLoad: function (client) {

  },

   /**
   * @param {Client} client 
   * @param {Message} message 
   * @param {Array<String>} args 
   */

  onRequest: async function (client, message, args) {
      let embed = new EmbedBuilder()
        let data = await GUILDS_SETTINGS.findOne({guildID: sistem.SUNUCU.GUILD})
        let ayar = data.Ayarlar
        if (["ekle", "Ekle", "add", "Add","at"].some(kontrol => kontrol === args[0])) {
			let tags = args[1];
            if(!tags) return message.react(message.guild.emojiGöster(emojiler.no_cartel) ? message.guild.emojiGöster(emojiler.no_cartel).id : undefined); 
			if (ayar.yasakTaglar && ayar.yasakTaglar.includes(tags)) return message.channel.send({embeds: [embed.setColor("Random").setDescription(`${message.guild.emojiGöster(emojiler.no_cartel)} Eklemeye çalıştığınız \`${tags}\` zaten yasaklı tag/etiket listesinde.`)]}).then(x => {
                setTimeout(() => {
                    x.delete()
                }, 7500);
            }),message.react(message.guild.emojiGöster(emojiler.no_cartel) ? message.guild.emojiGöster(emojiler.no_cartel).id : undefined)
			
            GUILDS_SETTINGS.findOne({guildID: sistem.SUNUCU.GUILD}, async (err, res) => {
                let yasakTags = []
                if(ayar.yasakTaglar) yasakTags = [...ayar.yasakTaglar]
                    yasakTags.push(tags)
                    await GUILDS_SETTINGS.updateOne({guildID: sistem.SUNUCU.GUILD}, {$set: {"Ayarlar.yasakTaglar": yasakTags}},{upsert: true})

                    let cartelimler = message.guild.members.cache.filter(u => u.user.username.includes(tags) || u.user.discriminator.includes(tags))
					await message.channel.send({embeds: [embed.setColor("Random").setDescription(`${message.guild.emojiGöster(emojiler.onay_cartel)} Başarılı bir şekilde \`${tags}\` tagını yasaklı taglar/etiketler listesine ekledin.
${message.guild.emojiGöster(emojiler.Terfi.miniicon)} Bu tagda veya etikette bulunan üyeler: ${cartelimler.map(x => x).slice(0,7).join(", ")} ${cartelimler.size > 7 ? `ve ${cartelimler.size - 7} daha fazlası...` : ''}`)]}).then(x => {
    setTimeout(() => {
        x.delete()
    }, 7500);
})
message.react(message.guild.emojiGöster(emojiler.onay_cartel) ? message.guild.emojiGöster(emojiler.onay_cartel).id : undefined)
					cartelimler.forEach(async (cartelim, index) => {
						setTimeout(async () => {
                 
                            cartelim.send(`**Merhaba!**
Üzerinizde bulunan **\` ${args[1]} \`** bu sembol veya etiket yasaklandığı için sizi yasaklı kategorisine ekledik.
\`\`\`
Üzerinizde bulunan yasaklı tag çıkarıldığında kayıtlı iseniz otomatik kayıt olacaksınız kayıtlı değilseniz kayıtsıza tekrardan düşeceksiniz.
\`\`\``).catch(err => {})
							await cartelim.setRoles(roller.yasaklıTagRolü).catch(() => {})
						}, 1500)
					});
				
			})
		}
        if (["kaldır", "sil", "remove", "delete", "Sil","çıkar","Çıkart"].some(kontrol => kontrol === args[0])) {
            let tags = args[1];
            if(!tags) return message.react(message.guild.emojiGöster(emojiler.no_cartel) ? message.guild.emojiGöster(emojiler.no_cartel).id : undefined);
            if (ayar.yasakTaglar && !ayar.yasakTaglar.includes(tags)) return message.channel.send({embeds: [embed.setColor("Random").setDescription(`${message.guild.emojiGöster(emojiler.no_cartel)} Eklemeye çalıştığınız \`${tags}\` zaten yasaklı tag/etiket listesinde bulunmuyor.`)]}).then(x => {
                setTimeout(() => {
                    x.delete()
                }, 7500);
            }),message.react(message.guild.emojiGöster(emojiler.no_cartel) ? message.guild.emojiGöster(emojiler.no_cartel).id : undefined)
            const findUser = ayar.yasakTaglar.find(cartel => cartel == tags);
            await GUILDS_SETTINGS.updateOne({ guildID: message.guild.id }, { $pull: { "Ayarlar.yasakTaglar": findUser } }, { upsert: true })
            let cartelimler = message.guild.members.cache.filter(u => u.user.username.includes(tags) || u.user.discriminator.includes(tags))
            await message.channel.send({embeds: [embed.setColor("Random").setDescription(`${message.guild.emojiGöster(emojiler.onay_cartel)} Başarılı bir şekilde \`${tags}\` tagını yasaklı taglar/etiketler listesinden çıkarttınız.
${message.guild.emojiGöster(emojiler.Terfi.miniicon)} Bu tagda veya etikette bulunan üyeler: ${cartelimler.map(x => x).slice(0,7).join(", ")} ${cartelimler.size > 7 ? `ve ${cartelimler.size - 7} daha fazlası...` : ''}`)]}).then(x => {
setTimeout(() => {
x.delete()
}, 7500);
})
message.react(message.guild.emojiGöster(emojiler.onay_cartel) ? message.guild.emojiGöster(emojiler.onay_cartel).id : undefined)
            cartelimler.forEach(async (cartelim, index) => {
                setTimeout(async () => {
                    cartelim.send(`**Merhaba!**
Üzerinizde bulunan **\` ${args[1]} \`** bu sembol veya etiket yasağı kaldırıldığından dolayı sizi yasaklı kategorisinden çıkarttık.`).catch(err => {})
                    let User = await Users.findOne({_id: cartelim.id});
                    if(!ayarlar.taglıalım && User && User.Name && User.Names && User.Gender) {
                        if(cartelim && cartelim.manageable && ayarlar.type && ayarlar.isimyas) cartelim.setNickname(`${ayarlar.type ? cartelim.user.username.includes(ayarlar.tag) ? ayarlar.tag + " " : (ayarlar.tagsiz ? ayarlar.tagsiz + " " : (ayarlar.tag || "")) : ""}${User.Name}`)
                        if(User.Gender == "Erkek") await cartelim.setRoles(roller.erkekRolleri).catch(err => {})
                        if(User.Gender == "Kadın") await cartelim.setRoles(roller.kadınRolleri).catch(err => {})
                        if(User.Gender == "Kayıtsız") cartelim.setRoles(roller.kayıtsızRolleri).catch(err => {})
                        if(cartelim.user.username.includes(ayarlar.tag)) cartelim.roles.add(roller.tagRolü).catch(err => {})
                    } else {
                        cartelim.setRoles(roller.kayıtsızRolleri).catch(err => {})
                        if(cartelim && cartelim.manageable && ayarlar.type && ayarlar.isimyas) await cartelim.setNickname(`${cartelim.user.username.includes(ayarlar.tag) ? ayarlar.tag : (ayarlar.tagsiz ? ayarlar.tagsiz : (ayarlar.tag || ""))} İsim | Yaş`)
                        if(cartelim && cartelim.manageable && !ayarlar.type && ayarlar.isimyas) await cartelim.setNickname(`İsim | Yaş`)
                        if(cartelim && cartelim.manageable && !ayarlar.type && !ayarlar.isimyas) await cartelim.setNickname(`Kayıtsız`)
                        if(cartelim && cartelim.manageable && ayarlar.type && !ayarlar.isimyas) await cartelim.setNickname(`${cartelim.user.username.includes(ayarlar.tag) ? ayarlar.tag : (ayarlar.tagsiz ? ayarlar.tagsiz : (ayarlar.tag || ""))} Kayıtsız`)
                    }
                }, 1500)
            });
            };

    if(!args[0]) {
        message.reply({embeds: [embed.setColor("Random").setDescription(`**Merhaba!** ${message.member.user.tag}
**${message.guild.name}** sunucusuna ait yasaklı tag/etiket listesi aşağıda belirtilmiştir.

**Yasaklı taglar/etiketler sıralanmaktadır**:
${ayar.yasakTaglar ? ayar.yasakTaglar.map(x => {
    return {
        Id: x,
        Total: message.guild.members.cache.filter(u => u.user.username.includes(x))
    };
}).sort((a, b) => b.Total - a.Total).splice(0, 15).map((user, index) => `\`${index + 1}.\` **${user.Id}** (\`${user.Total.size} üye\`)`).join("\n") || `\`\`\`fix
Yasaklı tag/etiket bulunamamıştır.\`\`\`` : `\`\`\`fix
Yasaklı tag/etiket bulunamamıştır.\`\`\``}`)]}).then(x => {
    setTimeout(() => {
        x.delete()
    }, 30000);
})
    }
    
    }
};