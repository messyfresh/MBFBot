require('dotenv').config()

const Discord = require('discord.js');
const client = new Discord.Client();

client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {
    // split message content into array
    var msg = message.content.split(' ');

    // check for command prefix
    if (msg[0] === "!dm") {
        console.log(msg)
        //TODO https://stackoverflow.com/questions/41745070/sending-private-messages-to-user
    }
	
    //console.log(msg)
});

client.login(process.env.BOT_TOKEN);