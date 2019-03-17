const levels = ['error', 'warn', 'info', 'debug'];
const Logger = require('./Logger');

module.exports = levels.reduce((loggers, level) => {
	const logger = new Logger(level);
	loggers[level] = logger.log.bind(logger);

	return loggers;
}, {});
