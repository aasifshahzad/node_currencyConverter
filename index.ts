import inquirer from "inquirer"; //import modules
import chalk from "chalk";

let exchangeRateApiPKR = "https://v6.exchangerate-api.com/v6/5b72248148edc444639e6f1d/latest/PKR"; //
//console.log(exchangeRateApi); // api to give exchange rate according to PKR

let fetchData = async (data: any) => { // getting response from API
    let fetchData = await fetch(data);
    let response = await fetchData.json();
    return response.conversion_rates; // targeting only conversion rates
};
let data = await fetchData(exchangeRateApiPKR);
//console.log(data);

let countries = Object.keys(data); //obtaining countries name from data

let firstCountry = await inquirer.prompt( // First currency
    {
        type: "list",
        message: "Please select the first country: ",
        name: "name",
        choices: countries
    }
);
console.log(`Converting from: ${chalk.bold.greenBright(firstCountry.name)}`);

let userMoney = await inquirer.prompt( //amount to be converted
{
    type: "number",
    message: `Please enter the money in ${chalk.bold.greenBright(firstCountry.name)}: `,
    name: "money",
}
);
//console.log(`You entered amount ${chalk.bold.greenBright(userMoney.money)} in ${chalk.bold.greenBright(firstCountry.name)}`);


let secondCountry = await inquirer.prompt( // second currency
{
    type: "list",
    message: "Please select the second country: ",
    name: "name",
    choices: countries
}
);
console.log(`Converting to: ${chalk.bold.greenBright(secondCountry.name)}`);

let conversionAPI = `https://v6.exchangerate-api.com/v6/5b72248148edc444639e6f1d/pair/${firstCountry.name}/${secondCountry.name}/${userMoney.money}` //conversion API
//console.log(conversionAPI);


let conversionData = async (data: any) => {
    let conversionData = await fetch(data);
    let response = await conversionData.json();
    return response.conversion_result;
};
let conversion_result = await conversionData(conversionAPI);
console.log(`${userMoney.money} ${firstCountry.name} equals to ${conversion_result} ${secondCountry.name}. `);