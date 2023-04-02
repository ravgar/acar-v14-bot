const { Client, Message, EmbedBuilder  } = require("discord.js");
const Kullanıcı = require('../../../../database/Schemas/Client.Users');
const { cartelEmbed } = require("../../../../base/Reference/Embed");
const Stats = require('../../../../database/Schemas/Plugins/Client.Users.Stats');
module.exports = {
    Isim: "üyesıfırla",
    Komut: ["date-user-delete", "kayıt-temizle", "register-data-delete","üyetemizle"],
    Kullanim: "kayıt-temizle",
    Aciklama: "Belirtilen ceza numarasının bütün bilgilerini gösterir.",
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
    let cartelim = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || await client.getUser(args[0])
    if(!cartelim) return message.channel.send(`${message.guild.emojiGöster(emojiler.no_cartel)} Bir üye belirtmelisin.`)
    if(!await Kullanıcı.findOne({ _id: cartelim.id })) return message.channel.send(`${cevaplar.prefix} ${cartelim} profiline sahip üyenin sunucu üzerinde verisi bulunamadı.`);
    await cartelim.Delete()
    await Stats.deleteOne({userID: cartelim.id})
    await Kullanıcı.deleteOne({_id: cartelim.id});
    await message.channel.send({embeds: [new EmbedBuilder().setDescription(`${message.guild.emojiGöster(emojiler.onay_cartel)} ${cartelim} üyesinin tüm verileri ve tüm kayıt bilgileri sunucudan temizlendi.`)]})
    await message.react(message.guild.emojiGöster(emojiler.onay_cartel) ? message.guild.emojiGöster(emojiler.onay_cartel).id : undefined)
    }
};