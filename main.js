const { Client } = require('whatsapp-web.js');
const qrcode  = require('qrcode-terminal');
const fs = require('fs');
const CPP = require('./modules/cpp.js');

const FILE_PATH = './modules/session.json';
let sessionFile;
if (fs.existsSync(FILE_PATH)) {
    sessionFile = require(FILE_PATH);
}

const client = new Client({
    session: sessionFile
});

client.on('qr', (qr) => {
    qrcode.generate(qr, {small: true})
});

client.on('ready', () => {
    console.log("Client is ready!")
});

client.on('authenticated', (session) => {
    sessionData = session;
    fs.writeFile('./modules/session.json', JSON.stringify(session), function (err) {
        if (err) {
            console.error(err);
        }
    });
});

client.on('message', async msg => {
    let chat = await msg.getChat();
    console.log(`Received message: ${msg.body} (Chat: ${chat.name})`);

    if (msg.body === '!help'){
        let message = `Irei te ajudar.
        \nAqui está a lista de comandos disponíveis:
        \n!price [simbolo] [quantia] = Retorna a cotação do simbolo escolhido. QUANTIA opcional.
        \n!convert [valor] [base] [cotação] = Retorna a cotação total de uma moeda na cotação determinada.
        \n!buy [quantidade] [base] [cotação] [spread] = Retorna a quantia de moedas a ser compradas com agil para baixo.
        \n!sell [quantidade] [base] [cotação] [spread] = Retorna a quantia de moedas a ser vendida com agil para cima.
        \n!brlbuy [quantidade] [cripto] [spread] = Retorna a quantidade de moedas a serem compradas a partir da quantidade de reais e ágil para baixo.
        \n!brlsell [quantidade] [cripto] [spread] = Retorna a quantidade de moedas a serem vendidas a partir da quantidade de reais e ágil para cima.`
        msg.reply(message)
    }
    
    else if (msg.body.startsWith('!price')){
        var props = msg.body.split(' ')
        if (props.length < 2){
            msg.reply('Informe o simbolo que deseja após o comando !price.')
        }
        else{
            value = props[2] ? props[2] : 1
            CPP.getPrice(props[1], parseFloat(value))
                .then(resp => msg.reply(resp.replace(  /\./g, ",")))
        }
    }
    else if (msg.body.startsWith('!sell')){
        var props = msg.body.split(' ')
        if (props.length < 5) {
            msg.reply('Informe quantidade, base, cotação e spread que deseja após o comando !sell')
        } else {
            CPP.sellPrice(props[1], props[2], props[3], props[4])
                .then(resp => msg.reply(resp.replace(  /\./g, ",")))
        }
    }
    
    else if (msg.body.startsWith('!buy')){
        var props = msg.body.split(' ')
        if (props.length < 5) {
            msg.reply('Informe quantidade, base, cotação e spread que deseja após o comando !buy')
        } else {
            CPP.buyPrice(props[1], props[2], props[3], props[4])
                .then(resp => msg.reply(resp.replace(  /\./g, ",")))
        }
    }
    
    else if (msg.body.startsWith('!brlsell')){
        var props = msg.body.split(' ')
        if (props.length < 4) {
            msg.reply('Informe quantidade em BRL, cripto e spread que deseja após o comando !brlsell')
        } else {
            CPP.brlsell(props[1], props[2], props[3])
                .then(resp => msg.reply(resp.replace(  /\./g, ",")))
        }
    }
    
    else if (msg.body.startsWith('!brlbuy')){
        var props = msg.body.split(' ')
        if (props.length < 4) {
            msg.reply('Informe quantidade em BRL, cripto e spread que deseja após o comando !brlbuy')
        } else {
            CPP.brlbuy(props[1], props[2], props[3])
                .then(resp => msg.reply(resp.replace(  /\./g, ",")))
        }
    }
    
    else if (msg.body.startsWith('!convert')){
        var props = msg.body.split(' ')
        if (props.length < 4) {
            msg.reply('Informe o valor, a base e a cotação que deseja após o comando !convert')
        } else {
            CPP.convert(props[1], props[2], props[3])
                .then(resp => msg.reply(resp.replace(  /\./g, ",")))
        }
    }
})


client.initialize();