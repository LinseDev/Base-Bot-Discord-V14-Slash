const Discord = require("discord.js")
require('dotenv').config();

const client = new Discord.Client({ 
  intents: [ 
Discord.GatewayIntentBits.Guilds,
Discord.GatewayIntentBits.GuildMembers,
Discord.GatewayIntentBits.GuildBans,
       ]
    });

console.clear()

module.exports = client;

client.slashCommands = new Discord.Collection();
client.aliases = new  Discord.Collection();

require('./handler')(client);

const connectiondb = require("./database/connect")
connectiondb.start();

client.login(process.env.token)

//ANTICRASH
process.on('unhandRejection', (reason, promise) => {
    console.log(`❗ | [Erro]\n\n` + reason, promise);
  });
  process.on('uncaughtException', (error, origin) => {
    console.log(`❗ | [Erro]\n\n` + error, origin);
  });
  process.on('uncaughtExceptionMonitor', (error, origin) => {
    console.log(`❗ | [Erro]\n\n` + error, origin);
  });
//outro codigo abaixo

  client.on("interactionCreate", (interaction) => {
    if (interaction.isButton()) {
        if (interaction.customId === "ticket") {
            if (interaction.guild.channels.cache.find(ca => ca.name === `${interaction.user.id}-🎟`)) {
                let canal = interaction.guild.channels.cache.find(ca => ca.name === `${interaction.user.id}-🎟`);

let jaTem = new Discord.EmbedBuilder()
.setDescription(`❌ **Calma! Você já tem um ticket criado em: ${canal}.**`)
.setColor('#ff0000')
              
interaction.reply({ embeds: [jaTem], ephemeral: true })
            } else {
    let cargostaff = '1107454842974249063'; //Id do cargo de staff.
                interaction.guild.channels.create({
                    name: `${interaction.user.id}-🎟`,
                    type: 0, //Canal de texto
                    parent: '1107451404643221635', //Id da categoria
                    permissionOverwrites: [
                        {
                            id: interaction.guild.id,
                            deny: ["ViewChannel"]
                        },
                        {
                            id: interaction.user.id,
                            allow: ["ViewChannel", "SendMessages", "AddReactions", "AttachFiles"]
                        },
                       {
                            id: cargostaff, //id do cargo staff
                            allow: ["ViewChannel", "SendMessages", "AddReactions", "AttachFiles", "ManageMessages"]
                        }
                    ]
                }).then(ca => {

                    let direciandoaocanal = new Discord.ActionRowBuilder().addComponents(
                        new Discord.ButtonBuilder()
                        .setLabel(`Ticket`)
                        .setEmoji(`🎫`)
                        .setStyle(5)
                        .setURL(`https://discord.com/channels/${interaction.guild.id}/${ca.id}`)
                    )
                    let newTicket = new Discord.EmbedBuilder()
                    .setDescription(`${interaction.user} **Um novo ticket foi aberto: ${ca}!** <a:alerta:1107002621421682698> `)
                    .setColor('Purple')

                    interaction.reply({ embeds: [newTicket], components: [direciandoaocanal], ephemeral: true })


let embed = new Discord.EmbedBuilder()
.setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
.setDescription(`${interaction.user} *Seja bem vindo(a) ao meu sistema de ticket, aguarde os staffs entrarem em contato contigo, após a conduta fechar o ticket com: \`🗑\`*`);

const b1 = new Discord.ButtonBuilder()
.setCustomId("closet")
.setEmoji("🗑")
.setStyle(4)
let botao = new Discord.ActionRowBuilder().addComponents(b1);
                          
ca.send({ content: `**🔔 - <@&${cargostaff}>**`, embeds: [embed], components: [botao] }).then(msg => msg.pin())
ca.send(`${interaction.user}`).then(msg => setTimeout(msg.delete.bind(msg), 5000)) 
                })
            }

        } else if (interaction.customId === "closet") {

let bye = new Discord.EmbedBuilder()
.setDescription(`📤 **Plin plin, estarei fechando este ticket em: \`6 segundos\` .**`)
.setColor('Random')

            interaction.reply({ embeds: [bye]}).then(() => {
                setTimeout(() => {
                    interaction.channel.delete();
                }, 6000)
            })
        }
    }
}); 

// final do ticket



// afk inicio 


client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (await db.get(`modo_afk_${message.author.id}`) === true) {
    message.reply(`Olá ${message.author}, seu modo AFK foi desativado!`)
    await db.delete(`modo_afk_${message.author.id}`)
  }

  let afk_user = message.mentions.members.first()
  if (!afk_user) return;

  if (afk_user) {
  let afk_mode = await db.get(`modo_afk_${afk_user.id}`);
  if (afk_mode === true) {
    let afk_motivo = await db.get(`motivo_afk_${afk_user.id}`);
    message.reply(`Olá ${message.author}, o usuário **${afk_user.user.username}** está com o modo AFK ativado pelo motivo: \`${afk_motivo}\``)
  } else {
    return;
  }
  }
});

// afk final


// antilink inicio

const { QuickDB } = require("quick.db")
const db = new QuickDB(); // npm i quick.db better-sqlite3

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  let confirm = await db.get(`antilink_${message.guild.id}`);
  if (confirm === false || confirm === null) {
    return;
  } else if (confirm === true) {
    if (message.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) return; // Caso o usuário tenha permissão de ADM, o bot vai permitir que o mesmo envie links
    if (message.content.toLocaleLowerCase().includes("http")) {
      message.delete()
      message.channel.send(`${message.author} Não envie links no servidor!`)
    }

  }
})

//antilink final


//ticket 2 



client.on("interactionCreate", (interaction) => {
  if (interaction.isSelectMenu()) {
    if (interaction.customId === "painel_ticket") {
      let opc = interaction.values[0]
      if (opc === "opc1") {

        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // Nova opção

        let nome = `📨-${interaction.user.id}`;
        let categoria = "" // Coloque o ID da categoria

        if (!interaction.guild.channels.cache.get(categoria)) categoria = null;

        if (interaction.guild.channels.cache.find(c => c.name === nome)) {
          interaction.reply({ content: `❌ Você já possui um ticket aberto em ${interaction.guild.channels.cache.find(c => c.name === nome)}!`, ephemeral: true })
        } else {
          interaction.guild.channels.create({
          name: nome,
          type: Discord.ChannelType.GuildText,
          parent: categoria,
          permissionOverwrites: [
            {
              id: interaction.guild.id,
              deny: [
                Discord.PermissionFlagsBits.ViewChannel
              ]
            },
            {
              id: interaction.user.id,
              allow: [
                Discord.PermissionFlagsBits.ViewChannel,
                Discord.PermissionFlagsBits.SendMessages,
                Discord.PermissionFlagsBits.AttachFiles,
                Discord.PermissionFlagsBits.EmbedLinks,
                Discord.PermissionFlagsBits.AddReactions
              ]
            }
          ]
        }).then( (ch) => {
          interaction.reply({ content: `✅ Olá ${interaction.user}, seu ticket foi aberto em ${ch}!`, ephemeral: true })
          let embed = new Discord.EmbedBuilder()
          .setColor("Random")
          .setDescription(`Olá ${interaction.user}, você abriu o ticket pela opção 1.`);
          let botao = new Discord.ActionRowBuilder().addComponents(
            new Discord.ButtonBuilder()
          .setCustomId("fechar_ticket")
          .setEmoji("🔒")
          .setStyle(Discord.ButtonStyle.Danger)
          );

          ch.send({ embeds: [embed], components: [botao] }).then( m => { 
            m.pin()
           })
        })
        }
        
      } else if (opc === "opc2") {

        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // Nova opção

        let nome = `📨-${interaction.user.id}`;
        let categoria = "" // Coloque o ID da categoria

        if (!interaction.guild.channels.cache.get(categoria)) categoria = null;

        if (interaction.guild.channels.cache.find(c => c.name === nome)) {
          interaction.reply({ content: `❌ Você já possui um ticket aberto em ${interaction.guild.channels.cache.find(c => c.name === nome)}!`, ephemeral: true })
        } else {
          interaction.guild.channels.create({
          name: nome,
          type: Discord.ChannelType.GuildText,
          parent: categoria,
          permissionOverwrites: [
            {
              id: interaction.guild.id,
              deny: [
                Discord.PermissionFlagsBits.ViewChannel
              ]
            },
            {
              id: interaction.user.id,
              allow: [
                Discord.PermissionFlagsBits.ViewChannel,
                Discord.PermissionFlagsBits.SendMessages,
                Discord.PermissionFlagsBits.AttachFiles,
                Discord.PermissionFlagsBits.EmbedLinks,
                Discord.PermissionFlagsBits.AddReactions
              ]
            }
          ]
        }).then( (ch) => {
          interaction.reply({ content: `✅ Olá ${interaction.user}, seu ticket foi aberto em ${ch}!`, ephemeral: true })
          let embed = new Discord.EmbedBuilder()
          .setColor("Random")
          .setDescription(`Olá ${interaction.user}, você abriu o ticket pela opção 2.`);
          let botao = new Discord.ActionRowBuilder().addComponents(
            new Discord.ButtonBuilder()
          .setCustomId("fechar_ticket")
          .setEmoji("🔒")
          .setStyle(Discord.ButtonStyle.Danger)
          );

          ch.send({ embeds: [embed], components: [botao] }).then( m => { 
            m.pin()
           })
        })
        }
        
      } else if (opc === "opc3") {

        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // Nova opção

        let nome = `📨-${interaction.user.id}`;
        let categoria = "" // Coloque o ID da categoria

        if (!interaction.guild.channels.cache.get(categoria)) categoria = null;

        if (interaction.guild.channels.cache.find(c => c.name === nome)) {
          interaction.reply({ content: `❌ Você já possui um ticket aberto em ${interaction.guild.channels.cache.find(c => c.name === nome)}!`, ephemeral: true })
        } else {
          interaction.guild.channels.create({
          name: nome,
          type: Discord.ChannelType.GuildText,
          parent: categoria,
          permissionOverwrites: [
            {
              id: interaction.guild.id,
              deny: [
                Discord.PermissionFlagsBits.ViewChannel
              ]
            },
            {
              id: interaction.user.id,
              allow: [
                Discord.PermissionFlagsBits.ViewChannel,
                Discord.PermissionFlagsBits.SendMessages,
                Discord.PermissionFlagsBits.AttachFiles,
                Discord.PermissionFlagsBits.EmbedLinks,
                Discord.PermissionFlagsBits.AddReactions
              ]
            }
          ]
        }).then( (ch) => {
          interaction.reply({ content: `✅ Olá ${interaction.user}, seu ticket foi aberto em ${ch}!`, ephemeral: true })
          let embed = new Discord.EmbedBuilder()
          .setColor("Random")
          .setDescription(`Olá ${interaction.user}, você abriu o ticket pela opção 3.`);
          let botao = new Discord.ActionRowBuilder().addComponents(
            new Discord.ButtonBuilder()
          .setCustomId("fechar_ticket")
          .setEmoji("🔒")
          .setStyle(Discord.ButtonStyle.Danger)
          );

          ch.send({ embeds: [embed], components: [botao] }).then( m => { 
            m.pin()
           })
        })
        }
        
      }
    }
  } else if (interaction.isButton()) {
    if (interaction.customId === "fechar_ticket") {
      interaction.reply(`Olá ${interaction.user}, este ticket será excluído em 5 segundos...`)
      setTimeout ( () => {
        try { 
          interaction.channel.delete()
        } catch (e) {
          return;
        }
      }, 5000)
    }
  }
})

// ticket 2 final

//autoroule



client.on("guildMemberAdd", (member) => {
  let cargo_autorole = member.guild.roles.cache.get("1107843316592156762") // Coloque o ID do cargo
  if (!cargo_autorole) return console.log("❌ O AUTOROLE não está configurado.")

  member.roles.add(cargo_autorole.id).catch(err => {
    console.log(`❌ Não foi possível adicionar o cargo de autorole no usuário ${member.user.tag}.`)
  })
})

// final autoroule
//call bot

const { joinVoiceChannel } = require('@discordjs/voice');

client.on("ready", () => {
  let canal = client.channels.cache.get("1107846571246227456") // coloque o ID do canal de voz
  if (!canal) return console.log("❌ Não foi possível entrar no canal de voz.")
  if (canal.type !== Discord.ChannelType.GuildVoice) return console.log(`❌ Não foi possível entrar no canal [ ${canal.name} ].`)

  try {

    joinVoiceChannel({
      channelId: canal.id, // ID do canal de voz
      guildId: canal.guild.id, // ID do servidor
      adapterCreator: canal.guild.voiceAdapterCreator,
    })
    console.log(`✅ Entrei no canal de voz [ ${canal.name} ] com sucesso!`)

  } catch(e) {
    console.log(`❌ Não foi possível entrar no canal [ ${canal.name} ].`)
  }

})
//tempcall bot