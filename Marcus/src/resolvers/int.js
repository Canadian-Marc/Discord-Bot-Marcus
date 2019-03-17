module.exports = (input, message, client, options) => {
	if(isNaN(input)) return null;
	else input 

	if(options.min && input < options.min) {
		return null;
	} else if(options.max && input > options.max) {
		return null;
	} else {
		return input;
	}
};
