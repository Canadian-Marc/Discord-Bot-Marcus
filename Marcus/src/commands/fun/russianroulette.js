const { Command: Base } = require('../../structures');
class Command extends Base {
	constructor(...args) {
		super(...args, {			
        description: 'Test your luck with a 6-chamber revolver!',
        guildOnly: true,
        aliases: ['rr']
        });
    }
    
async run({ reply }) {
    const r = ["😵💥\n\nThe bullet hit you directly in the head.", "😀🔫\n\nYou lived!", "😀🔫\n\nYou lived!", "😀🔫\n\nYou lived!", "😀🔫\n\nYou lived!", "😀🔫\n\nYou lived!"];
    
	let m = await reply("😬🔫\n\nSpinning...");
    var re = Math.floor((Math.random() * r.length));
    
        setTimeout(() => m.edit("😬🔫\n\n:three:"), 1000);
	    setTimeout(() => m.edit("😬🔫\n\n:two:"), 2000);
	    setTimeout(() => m.edit("😬🔫\n\n:one:"), 3000);
            setTimeout(() => m.edit(r[re]), 4000);   

        return
    }
}
module.exports = Command;