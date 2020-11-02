const Discord = require('discord.js')
const settings = require('../settings.json')
const db = require('quick.db')
/**@param {Discord.Client} client
 * @param {Discord.Message} message
 */
module.exports = async (message,client) => {

	let prefix = settings.prefix

if (!message.content.startsWith(prefix) || message.author.bot) return;
    const cooldowns = client.cooldowns
	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

	if (command.guildOnly && message.channel.type !== 'text') {
		return message.reply('This command is not valid for private messages.!');
	}

	if (command.args && !args.length) {
		let reply = `You offered no arguments, ${message.author}!`;

		if (command.usage) {
			reply += `\nConvenient use: \`${prefix}${command.name} ${command.usage}\``;
		}

		return message.channel.send(reply);
	}

	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;

	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`Please wait ${timeLeft.toFixed(1)} seconds for \`${command.name}\` command.`);
		}
	}

	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
	try {
		command.execute(message, args, client);
	} catch (error) {
		console.error(error);
		message.reply('An error occurred while trying to execute this command!');
	}

};