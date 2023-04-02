const { EmbedBuilder } = require("discord.js");
const moment = require('moment');
const { cartelEmbed } = require("../../../../base/Reference/Embed");
require('moment-duration-format');
require('moment-timezone');

module.exports = {
    Isim: "yetkipuan",
    Komut: ["altyetkipuan","yetkipuanekle"],
    Kullanim: "yetkipuan <@cartel/ID> <Puan>",
    Aciklama: "Belirlenen üyeyi terfi sistemine senkronize eder.",
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
    let embed = new EmbedBuilder()
    if(!sistem._rooter.rooters.includes(message.member.id) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku))) return;
    let kullArray = message.content.split(" ");
    let kullArgs = kullArray.slice(0);
    let cartelcim = message.mentions.members.first() || message.guild.members.cache.get(kullArgs[1]) || message.guild.members.cache.find(x => x.user.username.toLowerCase() === kullArgs.slice(1).join(" ") || x.user.username === kullArgs[1])
    if(!cartelcim) return message.reply(cevaplar.üye).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(message.author.id === cartelcim.id) return message.reply(cevaplar.kendi).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(ayarlar.type && !cartelcim.user.username.includes(ayarlar.tag)) return message.reply({
      content: `Belirtilen üyenin üzerinde ${ayarlar.tag} sembolü bulunmadığından işleme devam edilemiyor. ${cevaplar.prefix}`
    }).then(x => {
      setTimeout(() => {
        x.delete().catch(err => {})
      }, 7500);
    })
    if((ayarlar && ayarlar.yetkiliYasaklıTag) && ayarlar.yetkiliYasaklıTag.filter(x => x != ayarlar.tag).some(x => cartelcim.user.username.includes(x))) return message.reply({
      content: `Belirtilen üyenin üzerinde bir tag bulunmakta! Bu nedenden dolayı yetki işlemine devam edilemiyor. ${cevaplar.prefix}`
    }).then(x => {
      setTimeout(() => {
        x.delete().catch(err => {})
      }, 7500);
    })
    let yetkiKodu = parseInt(args[1]);
    if(isNaN(yetkiKodu)) return message.reply(cevaplar.argümandoldur).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    await client.Upstaffs.addPoint(cartelcim.id, yetkiKodu, "Bonus")
    message.guild.kanalBul("terfi-log").send({embeds: [embed.setColor("Random").setDescription(`${message.member} (\`${message.member.id}\`) isimli yönetici ${cartelcim} (\`${cartelcim.id}\`) isimli üyeye \`${yetkiKodu}\` yetki bonusu ekledi.`)]});
    message.react(message.guild.emojiGöster(emojiler.onay_cartel) ? message.guild.emojiGöster(emojiler.onay_cartel).id : undefined)
  }
};