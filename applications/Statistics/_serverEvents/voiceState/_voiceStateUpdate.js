const { VoiceState, AttachmentBuilder, Collection, ChannelType } = require("discord.js");
const Stats = require("../../../../database/Schemas/Plugins/Client.Users.Stats");
const Upstaffs = require("../../../../database/Schemas/Plugins/Client.Users.Staffs");
const Tasks = require('../../../../database/Schemas/Plugins/Client.Users.Tasks');
const GUILD_SETTINGS = require('../../../../database/Schemas/Global.Guild.Settings') 
const Users = require('../../../../database/Schemas/Client.Users');
const { cartelEmbed } = require("../../../../base/Reference/Embed");
const mscik = require('ms')
const statRecods = new Collection();
const moment = require('moment')
const Voices = new Collection();
const Seens = require('../../../../database/Schemas/Guild.Users.Seens');
let tm = require('../../../../base/Additions/Stats/Time.Manager');

 /**
 * @param {VoiceState} oldState
 * @param {VoiceState} newState 
 */

client.on("ready", async () => {
  client.logger.log("İstatistik, davet, yetki sistemi verileri güncellendi.", "stat")
  client.guilds.cache.get(sistem.SUNUCU.GUILD).channels.cache.filter(e => e.type == ChannelType.GuildVoice && e.members.size > 0).forEach(channel => {
    channel.members.filter(member => !member.user.bot).forEach(member => {

      Voices.set(member.id, {
        ChannelID: channel.id,
        Time: Date.now()
      });

      if(kanallar.ayrıkKanallar.some(x => channel.id == x)) {
        statRecods.set(member.id, {
          channel: channel.id,
          duration: Date.now()
        });
      } else {
        statRecods.set(member.id, {
          channel: channel.parentId || channel.id,
          duration: Date.now()
        });
      }
    });
  });

  setInterval(() => {
    Voices.each((value, key) => {
      Voices.set(key, {
        ChannelID: value.ChannelID,
        Time: Date.now()
      });
      dayStatsUpdate(key, value.ChannelID, Date.now() - value.Time)
    })
    statRecods.each((value, key) => {
      voiceInit(key, value.channel, getDuraction(value.duration));
      statRecods.set(key, {
        channel: value.channel,
        duration: Date.now()
      });
    });
  }, 3000);
});


module.exports = (oldState, newState) => {
if ((oldState.member && oldState.member.user.bot) || (newState.member && newState.member.user.bot)) return;

if (!oldState.channelId && newState.channelId) {
    Voices.set(oldState.id, {
        Time: Date.now(),
        ChannelID: newState.channelId
    });
    if(kanallar.ayrıkKanallar.some(x => newState.channelId == x)) {
      statRecods.set(oldState.id, {
        channel: newState.channelId,
        duration: Date.now()
      });  
    } else {
      statRecods.set(oldState.id, {
        channel: newState.guild.channels.cache.get(newState.channelId).parentId || newState.channelId,
        duration: Date.now()
      });
    }
}

if(!Voices.has(oldState.id)) {
  Voices.set(oldState.id, {
    Time: Date.now(),
    ChannelID: (oldState.channelId || newState.channelId)
  });
}
if (!statRecods.has(oldState.id)) {
  if(kanallar.ayrıkKanallar.some(x => newState.channelId == x) &&  kanallar.ayrıkKanallar.some(x => oldState.channelId == x)) {
      statRecods.set(oldState.id, {
        channel: newState.channelId,
        duration: Date.now()
      });
  } else {
    statRecods.set(oldState.id, {
      channel: newState.guild.channels.cache.get(oldState.channelId || newState.channelId).parentId || newState.channelId,
      duration: Date.now()
    });
  }
}
  let data = statRecods.get(oldState.id);
  let duration = getDuraction(data.duration);
  
  if (oldState.channelId && !newState.channelId) {
    let datacik = Voices.get(oldState.id);
    if(datacik) {
      Voices.delete(oldState.id);
      let durationtwo = Date.now() - datacik.Time;
      dayStatsUpdate(oldState.id, datacik.ChannelID, durationtwo, "VOICE", true)
    }

    voiceInit(oldState.id, data.channel, duration);
    statRecods.delete(oldState.id);
  } else if (oldState.channelId && newState.channelId) {
    let datacik = Voices.get(oldState.id);
    if(datacik) {
        Voices.set(oldState.id, {
          Time: Date.now(),
          ChannelID: newState.channelId
      });
      let durationtwo = Date.now() - datacik.Time;
      dayStatsUpdate(oldState.id, datacik.ChannelID, durationtwo, "VOICE")
    }
    voiceInit(oldState.id, data.channel, duration);
    if(kanallar.ayrıkKanallar.some(x => newState.channelId == x)) {
      statRecods.set(oldState.id, {
        channel: newState.channelId,
        duration: Date.now()
      });
    } else {
    statRecods.set(oldState.id, {
      channel: newState.guild.channels.cache.get(newState.channelId).parentId || newState.channelId,
      duration: Date.now()
    });
  }
  }
}

module.exports.config = {
    Event: "voiceStateUpdate"
} 
client.cartelSaatYap = (date) => { return moment.duration(date).format('H'); };
function getDuraction(ms) {
    return Date.now() - ms;
  };
  
 async function voiceInit(memberID, categoryID, duraction) {
    Stats.findOne({guildID: sistem.SUNUCU.GUILD, userID: memberID}, async (err, data) => {
      if (!data) {
        let voiceMap = new Map();
        let chatMap = new Map();
        let voiceCameraMap = new Map();
        let voiceStreamingMap = new Map();
        voiceMap.set(categoryID, duraction);
        let newMember = new Stats({
          guildID: sistem.SUNUCU.GUILD,
          userID: memberID,
          voiceStats: voiceMap,
          messageLevel: 1,
          messageXP: 0,
          voiceLevel: 1,
          voiceXP: 0,
          taskVoiceStats: voiceMap,
          upstaffVoiceStats: voiceMap,
          voiceCameraStats: voiceCameraMap,
          voiceStreamingStats:  voiceStreamingMap,       
          totalVoiceStats: duraction,
          lifeVoiceStats: voiceMap,
          lifeTotalVoiceStats: duraction,
          lifeChatStats: chatMap,
          lifeTotalChatStats: 0,
          allVoice: {},
          allMessage:{},
          allCategory: {},
          chatStats: chatMap,
          upstaffChatStats: chatMap,
          totalChatStats: 0,
        });
        newMember.save();
      } else {
        let lastUserData = data.voiceStats.get(categoryID) || 0;
        let lastLifeData = data.lifeVoiceStats.get(categoryID) || 0;
        let lastTaskData = data.taskVoiceStats.get(categoryID) || 0;
        let lastStaffData = data.upstaffVoiceStats.get(categoryID) || 0;
        data.voiceStats.set(categoryID, Number(lastUserData)+duraction);
        data.lifeVoiceStats.set(categoryID, Number(lastLifeData)+duraction);
        let cartelcim = client.guilds.cache.get(sistem.SUNUCU.GUILD).members.cache.get(memberID)
        if(cartelcim) {
          let datacikcik = await GUILD_SETTINGS.findOne({guildID: sistem.SUNUCU.GUILD})
          let guildData = datacikcik.Ayarlar
          if(guildData && guildData.seviyeSistemi) await voiceXP(cartelcim.id, duraction / 1000, cartelcim.voice ? cartelcim.voice.channel : null)
          if(_statSystem.system) {
            if(_statSystem.staffs.some(x => cartelcim.roles.cache.has(x.rol))) {
              data.upstaffVoiceStats.set(categoryID,  Number(lastStaffData)+duraction)
              datacikcik = await GUILD_SETTINGS.findOne({guildID: sistem.SUNUCU.GUILD})
              if(datacikcik && datacikcik.Ayarlar) {
                guildData = datacikcik.Ayarlar
                if(guildData && guildData.Etkinlik == true && (guildData.etkinlikIzinliler && guildData.etkinlikIzinliler.some(x => x == categoryID))) await client.Upstaffs.addPoint(cartelcim.id, guildData.etkinlikPuan ? guildData.etkinlikPuan : "0.001", "Etkinlik")
              }
            }
            let data2 = await Upstaffs.findOne({_id: cartelcim.id})
            if(data2 && data2.Mission) data.taskVoiceStats.set(categoryID, Number(lastTaskData)+duraction), checkTasks(cartelcim, data2)
          };
        }
        data.totalVoiceStats = Number(data.totalVoiceStats)+duraction;
        data.lifeTotalVoiceStats = Number(data.lifeTotalVoiceStats)+duraction
        data.save();
      };
    }).catch(err => {});
  }

      /**
     * @param {String} id 
     * @param {String} channel 
     * @param {Number} value 
     * @param {String} type
     */

  async function dayStatsUpdate (id, channel, value, type, ver) {
    let days = await tm.getDay(global.sistem.SUNUCU.GUILD)
    let kategori = client.channels.cache.get(channel)
    if(ver && kategori && (kanallar.publicKategorisi && kanallar.publicKategorisi == kategori.parentId)) {
      let cartelcim = kategori.guild.members.cache.get(id)
      if(cartelcim && cartelcim.voice && (cartelcim.voice.selfMute || cartelcim.voice.selfDeaf)) {
        cartelcim.Leaders("pub", (value / 1000 / 60 / 2) * 2, {type: "VOICE", channel: kategori})
      } else {
        cartelcim.Leaders("pub", (value / 1000 / 60 / 2) * 10, {type: "VOICE", channel: kategori})
      }
    }
    if(ver && kategori && (kanallar.registerKategorisi && kanallar.registerKategorisi == kategori.parentId)) {
      let cartelcim = kategori.guild.members.cache.get(id)
      if(cartelcim && cartelcim.voice && (cartelcim.voice.selfMute || cartelcim.voice.selfDeaf)) {
        cartelcim.Leaders("reg", (value / 1000 / 60 / 2) * 2, {type: "VOICE", channel: kategori})
        cartelcim.Leaders("teyit", (value / 1000 / 60 / 2) * 2, {type: "VOICE", channel: kategori})
        cartelcim.Leaders("kayıt", (value / 1000 / 60 / 2) * 2, {type: "VOICE", channel: kategori})
      } else {
        cartelcim.Leaders("reg", (value / 1000 / 60 / 2) * 10, {type: "VOICE", channel: kategori})
        cartelcim.Leaders("teyit", (value / 1000 / 60 / 2) * 10, {type: "VOICE", channel: kategori})
        cartelcim.Leaders("kayıt", (value / 1000 / 60 / 2) * 10, {type: "VOICE", channel: kategori})
      }
    }
    
    if(ver && kategori && (kanallar.streamerKategorisi && kanallar.streamerKategorisi == kategori.parentId)) {
      let cartelcim = kategori.guild.members.cache.get(id)
      if(cartelcim && cartelcim.voice && (cartelcim.voice.selfMute || cartelcim.voice.selfDeaf)) {
        cartelcim.Leaders("stream", (value / 1000 / 60 / 2) * 2, {type: "VOICE", channel: kategori})
        cartelcim.Leaders("cam", (value / 1000 / 60 / 2) * 2, {type: "VOICE", channel: kategori})
        cartelcim.Leaders("yayın", (value / 1000 / 60 / 2) * 2, {type: "VOICE", channel: kategori})
      } else {
        cartelcim.Leaders("stream", (value / 1000 / 60 / 2) * 10, {type: "VOICE", channel: kategori})
        cartelcim.Leaders("yayın", (value / 1000 / 60 / 2) * 10, {type: "VOICE", channel: kategori})
        cartelcim.Leaders("cam", (value / 1000 / 60 / 2) * 10, {type: "VOICE", channel: kategori})
      }
    }
    if(ver && kategori && (kanallar.sorunCozmeKategorisi && kanallar.sorunCozmeKategorisi == kategori.parentId)) {
      let cartelcim = kategori.guild.members.cache.get(id)
      if(cartelcim && cartelcim.voice && (cartelcim.voice.selfMute || cartelcim.voice.selfDeaf)) {
        cartelcim.Leaders("sorun", (value / 1000 / 60 / 2) * 2, {type: "VOICE", channel: kategori})
        cartelcim.Leaders("criminal", (value / 1000 / 60 / 2) * 2, {type: "VOICE", channel: kategori})
        cartelcim.Leaders("ceza", (value / 1000 / 60 / 2) * 2, {type: "VOICE", channel: kategori})
      } else {
        cartelcim.Leaders("sorun", (value / 1000 / 60 / 2) * 10, {type: "VOICE", channel: kategori})
        cartelcim.Leaders("criminal", (value / 1000 / 60 / 2) * 10, {type: "VOICE", channel: kategori})
        cartelcim.Leaders("ceza", (value / 1000 / 60 / 2) * 10, {type: "VOICE", channel: kategori})
      }
    }
    let kategoriget = client.channels.cache.get(kategori ? kategori.parentId : "123")
    if(ver && kategori && kategoriget && (kategoriget.name.includes("Etkinlik") || kategoriget.name.includes("etkinlik"))) {
      let cartelcim = kategori.guild.members.cache.get(id)
      if(cartelcim && cartelcim.voice && (cartelcim.voice.selfMute || cartelcim.voice.selfDeaf)) {
        cartelcim.Leaders("etkinlik", (value / 1000 / 60 / 2) * 2, {type: "VOICE", channel: kategori})
      } else {
        cartelcim.Leaders("etkinlik", (value / 1000 / 60 / 2) * 10, {type: "VOICE", channel: kategori})
      }
    }
    if(ver && kategori && kategoriget && (kategoriget.name.includes("oyun") || kategoriget.name.includes("Oyun") || kategoriget.name.includes("OYUN")) ) {
      let cartelcim = kategori.guild.members.cache.get(id)
      if(cartelcim && cartelcim.voice && (cartelcim.voice.selfMute || cartelcim.voice.selfDeaf)) {
        cartelcim.Leaders("oyun", (value / 1000 / 60 / 2) * 2, {type: "VOICE", channel: kategori})
      } else {
        cartelcim.Leaders("oyun", (value / 1000 / 60 / 2) * 10, {type: "VOICE", channel: kategori})
      }
    }
    if(kategori && kategori.parentId) {
      await Stats.updateOne({ userID: id, guildID: global.sistem.SUNUCU.GUILD }, { $inc: { [`allVoice.${days}.${channel}`]: value, [`allCategory.${days}.${kategori.parentId}`]: value } })
    } else {
      await Stats.updateOne({ userID: id, guildID: global.sistem.SUNUCU.GUILD }, { $inc: { [`allVoice.${days}.${channel}`]: value} })
    }

  }


  async function checkTasks (cartelcim, data2) {
    let data = await Stats.findOne({guildID: sistem.SUNUCU.GUILD, userID: cartelcim.id})
    let logEmbed = new EmbedBuilder().setThumbnail("https://preview.redd.it/qlne8pqzf0301.png?auto=webp&s=70da263d61a6d13378ff2b4aaab10e0bfa233fcf")
    let exRoleYetki = _statSystem.staffs.find(x => x.No == data2.staffExNo);
     let MissionData = await Tasks.findOne({roleID: exRoleYetki ? exRoleYetki.rol : 0, Active: true}) || await Tasks.findOne({ roleID: cartelcim.roles.hoist ? cartelcim.roles.hoist.id : 0 }) || await Tasks.findOne({ roleID: cartelcim.roles.highest ? cartelcim.roles.highest.id : 0 }) || await Tasks.findOne({ Users: cartelcim.id })
    let görevLog = cartelcim.guild.kanalBul("görev-tamamlayan")
    if(!MissionData) return;
    if(!MissionData.Active) return;
    if(MissionData.Active && MissionData.Time && MissionData.Time > 0 && Date.now() >= MissionData.Time) {
      let amınakodumunKanalı = cartelcim.guild.kanalBul("görev-bilgi")
      let tamamlayanlar = MissionData.Completed || []
      let tamamlamayanlar = []
      let rolGetir = cartelcim.guild.roles.cache.get(MissionData.roleID)
      if(rolGetir) {
        rolGetir.members.forEach(x => {
          if(!MissionData.Completed.includes(x.id)) tamamlamayanlar.push(x.id)
        })
        if(amınakodumunKanalı) amınakodumunKanalı.send({content: `${rolGetir}`, embeds: [new EmbedBuilder()
.setAuthor(rolGetir.name, "https://cdn.discordapp.com/emojis/943285259733184592.png?size=96&quality=lossless")
.setDescription(`Görev tamamlama zamanınız <t:${String(Date.now()).slice(0, 10)}:R> doldu!

**İlk görevi tamamlayan**: ${cartelcim.guild.members.cache.get(tamamlayanlar[0]) ? `${cartelcim.guild.members.cache.get(tamamlayanlar[0])}` : `\` Tespit Edilmedi! \``}
**Görevi tamamlayan**: \` ${tamamlayanlar.length} Kişi \`
**Görevi tamamlamayanlar**: \` ${tamamlamayanlar.length} Kişi \`

Görevi tamamlamayanlar yönetici onayı ile otomatik olarak düşürülecektir.
Görevi tamamlayanlar ise yönetici onayı ile otomatik olarak yükseltilecektir veya yeni göreve tabi tutulacaktır.
`).setFooter({text:`Anlık güncelleme ile "${rolGetir.name}" rolüne ait görev tamamiyle bitmiştir.`})], 

})
      }
      await Tasks.updateOne({roleID: MissionData.roleID}, {$set: {"Active": false}}, {upsert: true});
      return;
    }

    let public = 0;
    let register = 0;
    let genelses = 0;
    
    if(data) {
      data.taskVoiceStats.forEach(c => genelses += Number(c));
      if(roller.teyitciRolleri && roller.teyitciRolleri.some(x => cartelcim.roles.cache.has(x))) {
        data.taskVoiceStats.forEach((value, key) => {
          if(key == kanallar.registerKategorisi) public += Number(value)  
        })
      } else {
        data.taskVoiceStats.forEach((value, key) => {
            if(key == kanallar.publicKategorisi) public += Number(value)  
            if(key == kanallar.streamerKategorisi) public += Number(value)  
        });
      }
      
      if(!data2.Mission.CompletedAllVoice) {
        if(Number(client.cartelSaatYap(genelses)) >= MissionData.AllVoice) {
          if(MissionData.AllVoice <= 0) return; 
          if(görevLog) görevLog.send({embeds: [logembed.setColor("Random").setDescription(`${cartelcim} isimli görev sahibi, **Genel Ses** görevini <t:${String(Date.now()).slice(0, 10)}:R> tamamlayarak \`${MissionData.Reward ? MissionData.Reward  : uPConf.points.tasks}  Görev Puanı\` kazandı.`)]})
          await Users.updateOne({_id: cartelcim.id}, {$inc: {"Coin": MissionData.Reward ? MissionData.Reward  : uPConf.points.tasks}}, {upsert: true})
          await Upstaffs.updateOne({_id: cartelcim.id}, {$set: {"Mission.CompletedAllVoice": true}},{upsert: true})
          //await Stats.updateOne({guildID: sistem.SUNUCU.GUILD, userID: cartelcim.id}, {$set: {"taskVoiceStats": new Map()}}, {upsert: true})
          await Upstaffs.updateOne({ _id: cartelcim.id }, { $inc: { 
            "Mission.completedMission": 1,
            "Point": MissionData.Reward ? MissionData.Reward  : uPConf.points.tasks,
            "ToplamPuan": MissionData.Reward ? MissionData.Reward  : uPConf.points.tasks,
            "Görev": MissionData.Reward ? MissionData.Reward  : uPConf.points.tasks,
        } }, {upsert: true}); 

        return;
        }
      }

      if(!data2.Mission.CompletedPublicVoice) {
        if(Number(client.cartelSaatYap(public)) >= MissionData.publicVoice) {
          if(MissionData.public <= 0) return; 
          if(görevLog) görevLog.send({embeds: [logembed.setColor("Random").setDescription(`${cartelcim} isimli görev sahibi, Ses **(**\`Sohbet, Streamer ve Kayıt\`**)**  görevini <t:${String(Date.now()).slice(0, 10)}:R> tamamlayarak \`${MissionData.Reward ? MissionData.Reward  : uPConf.points.tasks}  Görev Puanı\` kazandı.`)]})
          await Users.updateOne({_id: cartelcim.id}, {$inc: {"Coin": MissionData.Reward ? MissionData.Reward  : uPConf.points.tasks}}, {upsert: true})
          await Upstaffs.updateOne({_id: cartelcim.id}, {$set: {"Mission.CompletedPublicVoice": true}},{upsert: true})
          //await Stats.updateOne({guildID: sistem.SUNUCU.GUILD, userID: cartelcim.id}, {$set: {"taskVoiceStats": new Map()}}, {upsert: true})
          await Upstaffs.updateOne({ _id: cartelcim.id }, { $inc: { 
            "Mission.completedMission": 1,
            "Point": MissionData.Reward ? MissionData.Reward  : uPConf.points.tasks,
            "ToplamPuan": MissionData.Reward ? MissionData.Reward  : uPConf.points.tasks,
            "Görev": MissionData.Reward ? MissionData.Reward  : uPConf.points.tasks,
        } }, {upsert: true}); 
        
        return;
        }
      }
      
      if(MissionData.countTasks && Number(MissionData.countTasks) > 0 && Number(data2.Mission.completedMission) && Number(data2.Mission.completedMission) >= 1) {
        if(Number(data2.Mission.completedMission) >= Number(MissionData.countTasks)) {
         if(MissionData.Completed && MissionData.Completed.length > 0 && MissionData.Completed.includes(cartelcim.id)) return;
         if(görevLog) görevLog.send({content:`${cartelcim}`,embeds: [new EmbedBuilder()
          .setThumbnail("https://cdn.discordapp.com/attachments/985356878034911313/985361738813808700/unknown.png")
          .setDescription(`${cartelcim} (\`${cartelcim.id}\`) isimli görev sahibi, görev gereksinimlerini başarıyla <t:${String(Date.now()).slice(0, 10)}:R> tamamladı. ${cartelcim.guild.emojiGöster(emojiler.onay_cartel)}
${MissionData.Completed.length > 0 ? `Onunla beraber <@&${MissionData.roleID}> rolünün görevini **${MissionData.Completed.filter(x => x != cartelcim.id).length}** kişi tamamladı.` : `Tebrik Ederim İlk <@&${MissionData.roleID}> Rolünün Görevini Tamamladı!`}`)
        ]})
        await Tasks.updateOne({roleID: MissionData.roleID}, {$push: {"Completed": cartelcim.id}}, {upsert: true})
        }
      }
    }   
  }


async function voiceXP(id, xp, channel) {
  let voiceXP = ((Math.random() * 0.025) + 0.001).toFixed(3);
  await Stats.updateOne({guildID: sistem.SUNUCU.GUILD, userID: id}, {$inc: {"voiceXP": xp * voiceXP}}, {upsert: true})
  let _getStat = await Stats.findOne({guildID: sistem.SUNUCU.GUILD, userID: id})
  if(_getStat) {
    let yeniLevel = _getStat.voiceLevel * 447;
    if (yeniLevel <= _getStat.voiceXP) {
      await Stats.updateOne({guildID: sistem.SUNUCU.GUILD, userID: id}, {$inc: {"voiceLevel": 1, "voiceXP": 0}}, {upsert: true})
      const {
        Canvas
    } = require('canvas-constructor');
    const {
        loadImage
    } = require('canvas');
    const {
        join
    } = require("path");
        let guild = client.guilds.cache.get(global.sistem.SUNUCU.GUILD)
        if(!guild) return;
        let cartelcim = guild.members.cache.get(id)
        if(!cartelcim) return;
      
         const avatar = await loadImage(cartelcim.user.avatarURL({format: "jpg"}));
         const background = await loadImage(`../../images/img/seviye.png`);      
        let xp = `${(_getStat.voiceLevel+1) * 447}`
         const image = new Canvas(740, 128)
        .printRoundedImage(background, 0, 0, 740, 128, 25)
         .printRoundedImage(avatar, 621, 12, 105.5, 105.5, 10)
         .setTextFont('14px Arial Black')
         .setColor("#fff")
         .printText(`+${2500*(_getStat.voiceLevel+1)} ${ayarlar.serverName} Parası`, 350, 70, 350)
         .setTextFont('14px Arial Black')
         .setColor("#fff")
         .printText(`+1 Değerli Altın`, 350, 105, 350)
        if(xp.toString().length > 4) { 
            image.setTextFont('16px Arial Black')
            image.setColor("#fff")
            image.printText(`${xp} XP`, 112, 115,350)
        } else {
            image.setTextFont('16px Arial Black')
            image.setColor("#fff")
            image.printText(`${xp} XP`, 118, 115,350)
        }
    if ((_getStat.voiceLevel).toString().length == 1) {
         image.setTextFont('38px Arial Black')
         image.setColor("#fff")
         image.printText(`${_getStat.voiceLevel}`, 53,77,350)
         } else {
         image.setTextFont('38px Arial Black')
         image.setColor("#fff")
         image.printText(`${_getStat.voiceLevel}`, 40,77,350)
         }
         if ((_getStat.voiceLevel+1).toString().length == 1) {
         image.setTextFont('38px Arial Black')
         image.setColor("#fff")
        image.printText(`${_getStat.voiceLevel+1}`, 233 , 77 ,350)
         } else {
         image.setTextFont('38px Arial Black')
         image.setColor("#fff")
         image.printText(`${_getStat.voiceLevel+1}`, 220, 77,350)
        }
        let attach = new AttachmentBuilder(image.toBuffer(), {name: "cartel-seviye.png"});
        let kanal = client.channels.cache.get(channel ? channel.id : undefined)
        if(!kanal) return;
        kanal.send({content: `**Tebrikler!** ${cartelcim}
Sesli sohbet seviyeniz yükseldi ve ödülleri kaptınız. (**\` ${_getStat.voiceLevel} -> ${_getStat.voiceLevel+1} \`**)`, files: [
           attach
        ]}).then(async (msg) => {

            setTimeout(() => {
                msg.delete().catch(err => {})
            }, 30000)
        })
    
    }
  }
}