const axios = require('axios')
const coins = require('./coins.json')
const moment = require('moment')

var filter  = (symbol) => {
    let obj = coins.find(a=>a.symbol === symbol.toUpperCase())
    return obj ? obj.id : null
}
var fixed = (numb) => {
    return numb < 1 ? 8 : 2
}

var emoji = (value) => {
    if (value < 0 && value > -10) {
        return '😩';
    } else if (value < -10) {
        return '😱';
    } else if (value >= 0 && value < 5) {
        return '☺️';
    } else if (value >= 5 && value < 10) {
        return '😍'
    }else if (value >= 10 && value < 20) {
        return '🚀';
    }else {
        return '🌙';
    }
}

var supply = (max, actual) => {
    let percent = parseInt((actual/max) * 10);
    var chart = '';
    for (var i = 0; i < 1; i++) {
        for (var j = 0; j < 10; j++) {
            if (j <= percent) {
                chart+='🟩';
            } else {
                chart+='⬜';
            }
        }
    }

    return chart
}

var CPP = {
    getPrice: (coin, value) => {
        return new Promise(function(resolve, reject) {
            let id = filter(coin)
            axios.get(`https://api.coinpaprika.com/v1/tickers/${id}?quotes=USD,BRL,BTC,GBP,EUR`)
            .then(function (response) {
                let f = fixed(response.data.quotes.BRL.price)
                resolve(
                `===== Cotação ${value} ${response.data.name} =====\n` + 
                `BRL:  R$  ${parseFloat((response.data.quotes.BRL.price * value)).toFixed(f)} (${response.data.quotes.BRL.percent_change_24h}%) ${emoji(response.data.quotes.BRL.percent_change_24h)}\n\n` +
                `USD:  $   ${parseFloat((response.data.quotes.USD.price * value)).toFixed(f)} (${response.data.quotes.USD.percent_change_24h}%) ${emoji(response.data.quotes.USD.percent_change_24h)}\n` + 
                `GBP:  £   ${parseFloat((response.data.quotes.GBP.price * value)).toFixed(f)} (${response.data.quotes.GBP.percent_change_24h}%) ${emoji(response.data.quotes.GBP.percent_change_24h)}\n` +
                `EUR:  €   ${parseFloat((response.data.quotes.EUR.price * value)).toFixed(f)} (${response.data.quotes.EUR.percent_change_24h}%) ${emoji(response.data.quotes.EUR.percent_change_24h)}\n` +
                `\n${parseFloat((response.data.quotes.BTC.price * value)).toFixed(8)} ₿ (${response.data.quotes.BTC.percent_change_24h}%) ${emoji(response.data.quotes.BTC.percent_change_24h)}\n` +
                `\nVol. 24h: $ ${parseFloat(response.data.quotes.USD.volume_24h).toFixed(2)} 📈\n` +
                `\nSupply: ${parseFloat((response.data.circulating_supply/response.data.max_supply) * 100).toFixed(2)}%` +
                `\n${supply(response.data.max_supply, response.data.circulating_supply)}` +
                `\n${response.data.circulating_supply} / ${response.data.max_supply}`+
                `\n\n🕒${moment().format('DD/MM/YY HH:mm:ss')}`
                )
            })
            .catch(function (error) {
                 
                resolve('Erro ao encontrar esta moeda. Tente novamente')
            })
        })
    },
    convert: (amount, base, quote) => {
        
        return new Promise(function(resolve, reject) {
            let bc = filter(base)
            let qc = filter(quote)
            axios.get(`https://api.coinpaprika.com/v1/price-converter?base_currency_id=${bc}&quote_currency_id=${qc}&amount=${amount}`)
            .then(function (response) {
                let f = fixed(response.data.price)
                resolve(
                `=== Conversão ${amount} ${base.toUpperCase()}/${quote.toUpperCase()} ===\n` + 
                `${amount} ${base.toUpperCase()} ↪️ ${parseFloat(response.data.price).toFixed(f)} ${quote.toUpperCase()}`+
                `\n\n🕒${moment().format('DD/MM/YY HH:mm:ss')}`
                )
            })
            .catch(function (error) {
                 
                resolve('Erro  na conversão. Tente novamente')
            })
        })
    },

    sellPrice: (amount, base, quote, spread) => {
        
        return new Promise(function(resolve, reject) {
            let bc = filter(base)
            let qc = filter(quote)
            let up = 1 + (spread/100)
            axios.get(`https://api.coinpaprika.com/v1/price-converter?base_currency_id=${bc}&quote_currency_id=${qc}&amount=${amount}`)
            .then(function (response) {
                axios.get(`https://api.coinpaprika.com/v1/tickers/${qc}?quotes=BRL`)
                .then((resp) => {
                    let f = fixed((response.data.price * up))
                    resolve(
                    `=== Venda de ${amount} ${base.toUpperCase()} + ${spread}% ===` + 
                    `\n${quote.toUpperCase()}: ${parseFloat(response.data.price * up).toFixed(f)}`+
                    `\nR$ ${parseFloat((response.data.price * up) * resp.data.quotes.BRL.price).toFixed(2)}`+
                    `\n\n🕒${moment().format('DD/MM/YY HH:mm:ss')}`
                    )
                })
                
            })
            .catch(function (error) {
                 
                resolve('Erro  ao calcular. Tente novamente')
            })
        })
    },

    buyPrice: (amount, base, quote, spread) => {
        
        return new Promise(function(resolve, reject) {
            let bc = filter(base)
            let qc = filter(quote)
            let up = 1 - (spread/100)
            axios.get(`https://api.coinpaprika.com/v1/price-converter?base_currency_id=${bc}&quote_currency_id=${qc}&amount=${amount}`)
            .then(function (response) {
                axios.get(`https://api.coinpaprika.com/v1/tickers/${qc}?quotes=BRL`)
                .then((resp) => {
                    let f = fixed((response.data.price * up))
                    resolve(
                    `=== Compra de ${amount} ${base.toUpperCase()} - ${spread}% ===` + 
                    `\n${quote.toUpperCase()}: ${parseFloat(response.data.price * up).toFixed(f)}`+
                    `\nR$ ${parseFloat((response.data.price * up) * resp.data.quotes.BRL.price).toFixed(2)}`+
                    `\n\n🕒${moment().format('DD/MM/YY HH:mm:ss')}`
                    )
                })
                
            })
            .catch(function (error) {
                 
                resolve('Erro  ao calcular. Tente novamente')
            })
        })
    },

    brlsell: (amount, cripto, spread) => {
        
        return new Promise(function(resolve, reject) {
            let bc = filter(cripto)
            axios.get(`https://api.coinpaprika.com/v1/tickers/${bc}?quotes=BRL`)
                .then((resp) => {
                    let quote = parseFloat(resp.data.quotes.BRL.price) * (1 + (spread/100))
                    let total = amount/quote
                    let coust = parseFloat(resp.data.quotes.BRL.price) * total
                    resolve(
                        `=== Venda de R$ ${amount} em ${cripto.toUpperCase()} ===` + 
                        `\nCotação: R$ ${parseFloat(quote).toFixed(fixed(quote))}` +
                        `\nTotal: ${parseFloat(total).toFixed(fixed(total))} ${cripto.toUpperCase()}` +
                        `\n\nCusto: R$ ${parseFloat(coust).toFixed(2)}🔥️`+
                        `\nLucro: R$ ${parseFloat(amount - coust).toFixed(2)}👍`+
                        `\n\n🕒${moment().format('DD/MM/YY HH:mm:ss')}`
                    )
                })
                .catch(function (error) {
                     
                    resolve('Erro  ao calcular. Tente novamente')
                })
        })
    },

    brlbuy: (amount, cripto, spread) => {
        
        return new Promise(function(resolve, reject) {
            let bc = filter(cripto)
            axios.get(`https://api.coinpaprika.com/v1/tickers/${bc}?quotes=BRL`)
                .then((resp) => {
                    let quote = resp.data.quotes.BRL.price * (1 - (spread/100))
                    let total = amount/quote
                    let coust = resp.data.quotes.BRL.price * total
                    resolve(
                        `=== Compra de R$ ${amount} em ${cripto.toUpperCase()} ===` + 
                        `\nCotação: R$ ${parseFloat(quote).toFixed(fixed(quote))}` +
                        `\nTotal: ${parseFloat(total).toFixed(fixed(total))} ${cripto.toUpperCase()}🔥`+
                        `\n\nEconomia: R$ ${parseFloat(amount - coust).toFixed(2)}👍`+
                        `\n\n🕒${moment().format('DD/MM/YY HH:mm:ss')}`
                    )
                })
                .catch(function (error) {
                     
                    resolve('Erro  ao calcular. Tente novamente')
                })
        })
    }
}

module.exports = CPP