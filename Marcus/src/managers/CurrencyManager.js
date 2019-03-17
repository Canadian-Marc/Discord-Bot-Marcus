class CurrencyManager {
    constructor(client) {
        this.client = client;
        this.cooldown = new Set();
    }


    async awardMessageCurrency(user) {
        const currencyDB = await this.client.managers.database.getUserCurrency(user);
        
        if(this.cooldown.has(user.id)) return
            var randomAmount = Math.floor(Math.random() * 25) + 10;

            let newValue = currencyDB.currency + randomAmount
            await this.client.managers.database.updateUserCurrency(user, newValue);

            await this.cooldown.add(user.id)
            setTimeout(() => this.cooldown.delete(user.id), 6e4)
        }

    async addTotalCurrency(user, amountEdited) {
        
        const currencyDB = await this.client.managers.database.getUserCurrency(user);

        let newValue = currencyDB.currency += amountEdited
        await this.client.managers.database.updateUserCurrency(user, newValue)
    }

    async deductTotalCurrency(user, amountEdited) {
        
        const currencyDB = await this.client.managers.database.getUserCurrency(user);

        let newValue = currencyDB.currency -= amountEdited
        await this.client.managers.database.updateUserCurrency(user, newValue)
    }
}

module.exports = CurrencyManager;