const fs = require('fs');
const Discord = require('discord.js');
const client = require('./client').client
const {token, prefix} = require('./client').settings
const moment = require("moment");
client.commands = new Discord.Collection();
client.cooldowns = new Discord.Collection();

/*              Commands                */
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`../commands/${file}`);
    client.commands.set(command.name, command);
    const date = new Date()
    console.log("["+ moment(date).format("DD/MM/YYYY HH:mm") + "]: Command named " + command.name + " is loaded")
}
/*              Commands                */


/*              Events                */
const reqEvent = (event) => require(`../events/${event}`);
client.on('message',(message) => reqEvent('message')(message,client));
client.on('ready', () => reqEvent('ready')(client));
/*              Events                */
