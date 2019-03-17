module.exports = input => {
	if(~['enable', 'yes', 'true', '1'].indexOf(input)) return true;
	else if(~['disable', 'no', 'false', '0'].indexOf(input)) return false;
	else return null;
};
