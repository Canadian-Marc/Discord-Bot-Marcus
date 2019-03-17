class ArgumentsManager {
    constructor(client) {
        this.client = client;
    }

    async resolve(message, command) {
        let args = [], flags = {};
        const placeholder = `%__${(Date.now() + process.hrtime().reduce((a, b) => a + b, 0)).toString(36)}__%`;
        const quoteRegex = /(["'])(?:(?=(\\?))\2.)*?\1/g;

        let replaced = '', prev = 0, match = quoteRegex.exec(message.content);
        while(match) {
            if(match.index === quoteRegex.lastIndex) quoteRegex.lastIndex++;

            replaced += message.content.substring(prev, match.index) + match[0].replace(/ /g, placeholder);

            prev = match.index + match[0].length;
            match = quoteRegex.exec(message.content);
        }
        
        replaced += message.content.substring(prev);
        const parsed = replaced.split(' ');

		for (let i = 0; i < command.args.length || 1; i++) {
			let arg, quoted;
			if(i >= (command.args.length - 1)) arg = parsed.splice(0).join(' ');
			else arg = parsed.splice(0, 1)[0];

            if(!arg) break;
            if(typeof arg === 'string' && (arg.startsWith(`"`) || arg.startsWith("'"))) {
                quoted = true;

                do {
                    if(arg.endsWith(arg.charAt(0))) {
                        quoted = false;
                        arg = arg.slice(1, -1);
                        break;
                    }
                    arg += parsed._.splice(0, 1)[0];
                } while(quoted && parsed._.length);
            }

            args.push(arg);
        }

        if(args.length < command.args.filter(arg => !arg.optional).length) {
            this.client.managers.commands.get('help').run({ args: [this.client.managers.commands.get(command.name)], reply: message.reply, author: message.author });
            return false;
        }

        for(let i = 0; i < args.length; i++) {
            let arg = args[i];
            let argOptions = command.args[i] || { type: 'text' };

            let resolvedArg = await this.resolveArg(argOptions, arg.toString(), message);
            if(resolvedArg === undefined || resolvedArg === null) {
                message.reply(`Unable to resolve the \`${argOptions.label || argOptions.type}\` argument.`);
                return false;
            }
            args[i] = resolvedArg;
        }

        return { args, flags };
    }

    resolveArg(arg, raw, message) {
        return require(`../resolvers/${arg.type}`)(raw, message, this.client, arg);
    }
}
module.exports = ArgumentsManager;