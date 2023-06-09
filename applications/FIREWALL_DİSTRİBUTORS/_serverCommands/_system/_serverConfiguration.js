const { Client, Message, Util, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder} = require("discord.js");
const StatsSchema = require('../../../../database/Schemas/Plugins/Client.Users.Stats');
const Users = require('../../../../database/Schemas/Client.Users')
const { cartelEmbed } = require("../../../../base/Reference/Embed");
const ms = require('ms')
module.exports = {
    Isim: "yapılandırma",
    Komut: ["yapilandir","yapılandır","yapilandirma"],
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
    

      let msg = await message.reply({content: `Yapılandırma hizmeti yükleniyor... Lütfen bekleyin!`});

      let Row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
          .setCustomId("isimyapilandirma")
          .setLabel("Toplu İsim Yapılandırması")
          .setStyle(ButtonStyle.Secondary)
          .setEmoji("998210562586583060"),
          new ButtonBuilder()
          .setCustomId("tagyapilandirma")
          .setLabel("Toplu Tag Yapılandırması")
          .setStyle(ButtonStyle.Secondary)
          .setEmoji("998210562586583060"),
          new ButtonBuilder()
          .setCustomId("sunucuyapılandırma")
          .setLabel("Sunucu Yapılandırması")
          .setStyle(ButtonStyle.Secondary)
          .setEmoji("998210562586583060"),
          new ButtonBuilder()
          .setCustomId("kanalrolyapilandirma")
          .setLabel("Toplu Kanal/Rol Yapılandırması")
          .setStyle(ButtonStyle.Secondary)
          .setEmoji("998210562586583060"),
      )

      await msg.edit({content: null,components: [Row], embeds: [
        
        new EmbedBuilder().setThumbnail(message.guild.iconURL({dynamic: true}))
        .setDescription(`Aşağıda bulunan düğmeler ile \`${message.guild.name}\` sunucusunun bot ve sunucu yapılandırma işlemlerini yapabilirsiniz. Yapılandırma işlemi yapıldığında, botunuzun çalışmasını kolaylaştıracaktır. Sunucu yapısı değiştiğinde, sunucu ismi veya tagı değiştiğinde tüm yapılandırmaları bu panelden yapabilirsiniz. Artık tek tek uğraşmaya son.`)
        .setColor("Random")

      ]})

      var filter = (i) => i.user.id == message.author.id;
      let collector = msg.createMessageComponentCollector({filter: filter, time: 60000})

      collector.on("collect", async (i) => {
          if(i.customId == "isimyapilandirma") {
              message.guild.members.cache.filter(x => !x.user.bot)
              .forEach(async (cartelim) => {
                let data = await Users.findOne({_id: cartelim.id})
                if(data && data.Name && data.Gender == "Kayıtsız") {
                  if(cartelim && cartelim.manageable && ayarlar.type && ayarlar.isimyas) await cartelim.setNickname(`${cartelim.user.username.includes(ayarlar.tag) ? ayarlar.tag : (ayarlar.tagsiz ? ayarlar.tagsiz : (ayarlar.tag || ""))} ${data.Name}`).catch(err => {})
                  if(cartelim && cartelim.manageable && !ayarlar.type && ayarlar.isimyas) await cartelim.setNickname(`${data.Name}`).catch(err => {})
                  if(cartelim && cartelim.manageable && ayarlar.type && !ayarlar.isimyas) await cartelim.setNickname(`${cartelim.user.username.includes(ayarlar.tag) ? ayarlar.tag : (ayarlar.tagsiz ? ayarlar.tagsiz : (ayarlar.tag || ""))} ${data.Name}`).catch(err => {})
                } else {
                  if(cartelim && cartelim.manageable && ayarlar.type && ayarlar.isimyas) await cartelim.setNickname(`${cartelim.user.username.includes(ayarlar.tag) ? ayarlar.tag : (ayarlar.tagsiz ? ayarlar.tagsiz : (ayarlar.tag || ""))} İsim | Yaş`).catch(err => {})
                  if(cartelim && cartelim.manageable && !ayarlar.type && ayarlar.isimyas) await cartelim.setNickname(`İsim | Yaş`).catch(err => {})
                  if(cartelim && cartelim.manageable && !ayarlar.type && !ayarlar.isimyas) await cartelim.setNickname(`Kayıtsız`).catch(err => {})
                  if(cartelim && cartelim.manageable && ayarlar.type && !ayarlar.isimyas) await cartelim.setNickname(`${cartelim.user.username.includes(ayarlar.tag) ? ayarlar.tag : (ayarlar.tagsiz ? ayarlar.tagsiz : (ayarlar.tag || ""))} Kayıtsız`).catch(err => {})
                }

      
              })
              i.reply({content: `**Başarıyla!** ${message.guild.name} sunucusunun isimleri yapılandırıldı! ${message.guild.emojiGöster(emojiler.onay_cartel)}`, ephemeral: true})
          }
         
      })

      collector.on("end", async (i, reason) => {
        if(reason == "time"){
          await msg.delete().catch(err => {})
        }
      })

    }
};