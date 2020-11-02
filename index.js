const { client, settings } = require('./utils/client');
require('./utils/loader')
require('./utils/functions')
client.login(settings.token)
