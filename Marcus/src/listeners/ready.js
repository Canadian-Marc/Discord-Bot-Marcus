module.exports = (client) => {
	client.logger.info('Marcus', `Ready! ${client.guilds.size.toLocaleString()} guilds.`);
	client.editStatus({ name: `${client.config.prefix}help` });
	require("../modules/stats.js")(client);
};