const { Client } = require('discord.js');
const client = new Client();

module.exports = {
    client: client,
    settings: require('../settings.json')
}