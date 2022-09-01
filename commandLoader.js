const Discord = require("discord.js")
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('node:fs');

module.exports = {
  start: async (client) => {
  	try {
      const commands = [];
      const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
      client.slashcommands = new Discord.Collection()
      
      const clientId = process.env.CLIENT_ID
      const guildId = process.env.GUILD_ID
      
      console.log('Loading commands:')
      for (const file of commandFiles) {
      	const command = require(`./commands/${file}`);
        console.log(command.data.name)
      	commands.push(command.data);
        client.slashcommands.set(command.data.name, command)
      }
      console.log('Finished Loading')
      
      const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);
  		console.log('Started refreshing application (/) commands.');

  		await rest.put(
  			Routes.applicationGuildCommands(clientId, guildId),
  			{ body: commands },
  		);
  
  		console.log('Successfully reloaded application (/) commands.');
  	} catch (error) {
  		console.error(error);
  	}
  }
}