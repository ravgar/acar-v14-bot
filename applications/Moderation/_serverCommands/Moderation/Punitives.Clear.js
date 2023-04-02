const { Client, Message, EmbedBuilder} = require("discord.js");
const Punitives = require('../../../../database/Schemas/Global.Punitives');
const Users = require('../../../../database/Schemas/Client.Users');
const { cartelEmbed } = require("../../../../base/Reference/Embed");
module.exports = {
    Isim: "cezatemizleme",
    Komut: ["cezatemizle"],
    Kullanim: "cezatemizle <#Ceza-No>",
    Aciklama: "Belirtilen ceza numarasının bütün bilgilerini gösterir.",
    Kategori: "kurucu",
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
    if(!sistem._rooter.rooters.includes(message.member.id) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku))) return message.reply(cevaplar.yetersiz).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(!Number(args[0])) return message.channel.send(`${cevaplar.prefix} \`Belirtilen argüman bir numaraya benzemiyor lütfen rakam kullanınız.\``).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    let cezabul = await Punitives.findOne({No: args[0]});
    if(!cezabul) return message.channel.send(`${cevaplar.prefix} Belirtilen \`#${args[0]}\` numaralı ceza bulunamadı.`).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
 if(cezabul && cezabul.Active) return message.channel.send(`${cevaplar.prefix} Belirtilen (\`#${args[0]}\`) ceza numarasında aktif ceza bulunduğundan dolayı işlem iptal edildi.`).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    await message.channel.send({embeds: [new EmbedBuilder().setDescription(`${message.guild.emojiGöster(emojiler.onay_cartel)} ${cezabul.Member ? message.guild.members.cache.get(cezabul.Member) ? message.guild.members.cache.get(cezabul.Member) : `<@${cezabul.Member}>` : `<@${cezabul.Member}>`} isimli üyeye ait \`#${cezabul.No}\` numaralı ceza sicilden temizlendi.`)]})
    await Punitives.updateOne({No: args[0]}, { $set: { Member: `Silindi #${cezabul.No} (${cezabul.Member})`, No: "-99999", Remover: `Sildi (${message.author.id})`} }, { upsert: true });
    await message.react(message.guild.emojiGöster(emojiler.onay_cartel) ? message.guild.emojiGöster(emojiler.onay_cartel).id : undefined)
    }
};