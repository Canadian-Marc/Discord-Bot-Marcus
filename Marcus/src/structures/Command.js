class Command {
    constructor(client, name, category, options) {
        this.client = client;
        this.name = name;
        this.category = category;
        this.description = options.description || 'No description provided.';
        this.examples = options.examples || ['None provided.'];
        this.args = options.args || [];
        this.guildOnly = !!options.guildOnly;
        this.aliases = options.aliases || [];
        this.permission = options.permission;
    }
}

module.exports = Command;