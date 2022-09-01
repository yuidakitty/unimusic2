const { Client, GatewayIntentBits } = require("discord.js")
const dotenv = require("dotenv")
const { REST } = require("@discordjs/rest")
const { Routes } = require("discord-api-types/v9")
const fs = require("fs")
const { Player } = require("discord-player")
const commandLoader = require('./commandLoader')
const playerUtils = require('./utils/playerUtils')
const keepAlive = require("./server")

dotenv.config()

const client = new Client({
  intents: [
    1,
    128
  ]
})

client.player = new Player(client, {
  ytdlOptions: {
    quality: "highestaudio",
    highWaterMark: 1 << 25
  }
})

commandLoader.start(client)
playerUtils.quitWhenSolo(client)

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}`)
client.user.setPresence({activities : [{name: 'Music Universally', type: 'PLAYING'}], status:'online'})
})

client.on("interactionCreate", (interaction) => {
  async function handleCommand() {
    if (!interaction.isCommand()) return

    const slashcmd = client.slashcommands.get(interaction.commandName)
    if (!slashcmd) interaction.reply("Not a valid slash command")

    await interaction.deferReply()
    await slashcmd.run({ client, interaction })
  }
  handleCommand()
})

keepAlive();
client.login(process.env.TOKEN)

client.on('debug', msg => console.log('debug: ', msg))
//music player debug
// client.player.on('debug', (msg)=>console.log('PlayerDebug: ', msg))
// client.player.on('error', (msg)=>console.log('PlayerError: ', msg))


