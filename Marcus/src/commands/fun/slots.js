const { Command: Base } = require('../../structures/');

class Command extends Base {
	constructor(...args) {
		super(...args, {			
        description: 'Gamble all your coins away! Each spin is 50 coins.'
        });
	}
async run({ reply, author }) {
    var results = ["🍪 ⭐ 💎",
        "🍪 💎 💎",
        "🍪 💎 ⭐",
        "🍪 ⭐ ⭐",
        "💎 ⭐ ⭐",
        "💎 🍪 ⭐",
        "💎 🍪 🍪",
        "💎 ⭐ 🍪",
        "⭐ 💎 💎",
        "⭐ 💎 🍪",
        "⭐ 🍪 🍪",
        "⭐ 🍪 💎",
        "⭐ ⭐ ⭐",
        "💎 💎 💎",
        "🍪 🍪 🍪", 
    ];

    var usercurrency = await this.client.managers.database.getUserCurrency(author)
        let currency = this.client.managers.currency
        
    if(usercurrency.currency < 50) return reply("You need **50** credits to play slots, sorry!")
        await currency.deductTotalCurrency(author, 50);

    let msg = await reply("Spinning...");

        var result1 = Math.floor((Math.random() * results.length) + 0);
        var result2 = Math.floor((Math.random() * results.length) + 0);
        var result3 = Math.floor((Math.random() * results.length) + 0);

            setTimeout(() => msg.edit(results[result1]), 500);
            setTimeout(() => msg.edit(results[result2]), 1000);
            setTimeout(() => msg.edit(results[result3]), 1500);

        await new Promise(resolve => setTimeout(resolve, 2000))

        var result = Math.floor((Math.random() * results.length) + 0);
            if(result == 12) return msg.edit(`RESULT: ${results[result]}\n\nYou won 1000 coins!`).then(() => currency.addTotalCurrency(author, 1000));
            if(result == 13) return msg.edit(`RESULT: ${results[result]}\n\nYou won 500 coins!`).then(() => currency.addTotalCurrency(author, 500));
            if(result == 14) return msg.edit(`RESULT: ${results[result]}\n\nYou won 250 coins!`).then(() => currency.addTotalCurrency(author, 250));

    return msg.edit(`RESULT: ${results[result]}`)
    }
}
module.exports = Command;