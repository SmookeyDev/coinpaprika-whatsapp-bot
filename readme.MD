## Sobre o projeto

Esse projeto surgiu a partir da ideia de converter o [Coinpaprika BR Bot](https://t.me/CppBrBot) do Telegram para o WhatsApp. Nesse bot é utilizado a biblioteca [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js) para a criação do mesmo e na checagem de cotação utilizamos a API da [Coinpaprika](https://api.coinpaprika.com/).

## Funcionalidades

| Funcionalidade  | Status |
| ------------- | ------------- |
| !price [símbolo] [quantia] = Retorna a cotação do simbolo escolhido. QUANTIA opcional.  | ✅  |
| !convert [valor] [base] [cotação] = Retorna a cotação total de uma moeda na cotação determinada. | ✅  |
| !buy [quantidade] [base] [cotação] [spread] = Retorna a quantia de moedas a ser compradas com agil para baixo.  | ✅  |
| !sell [quantidade] [base] [cotação] [spread] = Retorna a quantia de moedas a ser vendida com agil para cima. | ✅ |
| !brlbuy [quantidade] [cripto] [spread] = Retorna a quantidade de moedas a serem compradas a partir da quantidade de reais e ágil para baixo.  | ✅  |
| !brlsell [quantidade] [cripto] [spread] = Retorna a quantidade de moedas a serem vendidas a partir da quantidade de reais e ágil para cima. | ✅ |

## Versão de Telegram

* [Repositorio](https://github.com/marcosnunesmbs/coinpaprika-br-bot/)

## Créditos

* [Ícaro Sant'Ana](https://t.me/SmookeyDev) - Conversão para WhatsApp.
* [Marcos Nunes](https://t.me/SACNanoPay) - Versão de Telegram.