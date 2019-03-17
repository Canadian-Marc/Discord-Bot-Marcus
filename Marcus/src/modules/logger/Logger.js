const colours = {
	info: (text) => `\u001b[36m${text}\u001b[39m`,
	debug: (text) => `\u001b[90m${text}\u001b[39m`,
	warn: (text) => `\u001b[33m${text}\u001b[39m`,
	error: (text) => `\u001b[31m${text}\u001b[39m`
};

class Logger {
	constructor(level) {
		this.level = level;
	}

	log(label, message) {
		const timestamp = new Date().toLocaleString();
		label = label.charAt(0).toUpperCase() + label.substring(1);

		const formatted = `${colours[this.level](`[${timestamp}]`)} ${label} - ${message}`;

		(console[this.level] || console.log)(formatted);
	}
}

module.exports = Logger;
