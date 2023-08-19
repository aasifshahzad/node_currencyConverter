import fetch from 'node-fetch';
import inquirer from 'inquirer';

class CurrencyConverter {
    private apiUrl = 'https://api.exchangeratesapi.io/latest';
    private exchangeRates: Record<string, number> = {};
    private lastUpdateTime: number = 0;

    async updateExchangeRates(): Promise<void> {
        try {
            const currentTime = Date.now();
            if (currentTime - this.lastUpdateTime >= 3600000) {
                const response = await fetch(this.apiUrl);
                const data: { rates: Record<string, number> } = await response.json();

                if (data.rates) {
                    this.exchangeRates = data.rates;
                    this.lastUpdateTime = currentTime;
                    console.log('Exchange rates updated.');
                } else {
                    throw new Error('Failed to fetch exchange rates.');
                }
            } else {
                console.log('Using cached exchange rates.');
            }
        } catch (error: any) {
            throw new Error('Failed to update exchange rates.');
        }
    }

    async convert(amount: number, fromCurrency: string, toCurrency: string): Promise<number> {
        if (!(fromCurrency in this.exchangeRates) || !(toCurrency in this.exchangeRates)) {
            throw new Error('Unsupported currencies.');
        }

        const fromRate = this.exchangeRates[fromCurrency];
        const toRate = this.exchangeRates[toCurrency];

        const convertedAmount = (amount / fromRate) * toRate;
        return convertedAmount;
    }

    async askForCurrencies(): Promise<{ fromCurrency: string; toCurrency: string }> {
        const currencies = Object.keys(this.exchangeRates);

        const questions = [
            {
                type: 'list',
                name: 'fromCurrency',
                message: 'Select the source currency:',
                choices: currencies,
            },
            {
                type: 'list',
                name: 'toCurrency',
                message: 'Select the target currency:',
                choices: currencies,
            },
        ];

        const answers = await inquirer.prompt(questions);
        return answers;
    }
}

(async () => {
    const converter = new CurrencyConverter();

    try {
        await converter.updateExchangeRates();

        const amountToConvert = 100;
        const { fromCurrency, toCurrency } = await converter.askForCurrencies();

        const convertedAmount = await converter.convert(amountToConvert, fromCurrency, toCurrency);

        console.log(`${amountToConvert} ${fromCurrency} is approximately ${convertedAmount.toFixed(2)} ${toCurrency}.`);
    } catch (error) {
        console.error('An error occurred:', error.message);
    }
})();
