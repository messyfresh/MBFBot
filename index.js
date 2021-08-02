// Import .env config file
require('dotenv').config()

// Standard imports
const Discord = require('discord.js')
const client = new Discord.Client()

// Import JSON file with all messages and jokes
const msgDb = require("./dmMessages.json")

// Set DM Interval
dmInterval = 30000

let dmArray = []

const prefix = "!autodm"

// Log when ready
client.once('ready', () => {
	console.log('Ready!')
})

// Check messages
// TODO Add admin check to bot message parse
client.on('message', message => {

    // Split message content into array
    var msg = message.content.trim().split(/ +/)

    // Check for command prefix and command length of 3
    if (msg[0] === prefix && msg.length === 3) {
        if (msg[1] === "add"){
            // Get user from message mention
            try {
                const user = getUser(msg[2])
                dmArray.push(user)
                message.channel.send("Added user " + user.username + " to AutoDM List")
            } catch (e) {
                console.error(e)
                message.channel.send("Invalid Command")
                return
            }

        } else if (msg[1] === "remove" || msg[1] === "delete") {
            try {
                const user = getUser(msg[2])
                const usrIndex = dmArray.indexOf(user)
                dmArray.splice(usrIndex, 1)
                message.channel.send("Removed user " + user.username + " from AutoDM List")
            } catch (e) {
                console.error(e)
                message.channel.send("User not found in AutoDM List")
            }

        } else {
            message.channel.send("Invalid Command")
        }
    // Check for command prefix and command length 2
    } else if (msg[0] === prefix && msg.length === 2) {

        switch(msg[1]) {
            case "help":
                //TODO implement help command
                break
            // List all users in AutoDM List
            case "list":
                message.channel.send("Users in AutoDM List: " + dmArray.toString())
                break
            // Remove all users from AutoDM List
            case "removeall":
                dmArray = []
                message.channel.send("All users removed from AutoDM List")
                break
            default:
                message.channel.send("Invalid Command")
        }
    }
})

// Send DM to all users in dmArray
function parseDMArray(array) {
    if (array.length > 0) {
        array.forEach((user, i) => {
            sendDM(array[i])
        })
    } else {
        return
    }
}

// Send DM function
function sendDM(userObj) {
    //TODO Pick random message from msgDB
    let jokeOrMsg = getRandomInt(2)
    switch (jokeOrMsg){
        case 0:
            // Get number of messages from DB
            let msgCount = Object.keys(msgDb.messages).length
            let msgNum = getRandomInt(msgCount)
            userObj.send(msgDb.messages[msgNum + 1].toString())
            break
        case 1:
            let jokeCount = Object.keys(msgDb.jokes).length
            let jokeNum = getRandomInt(jokeCount)
            userObj.send(msgDb.jokes[jokeNum + 1][1])
            setTimeout(()=> {
                userObj.send(msgDb.jokes[jokeNum + 1][2])
            }, 3000)
            //console.log("Joke selected")
            break
    }
}

// Function to get a user object from a user string i.e. <!@xxxxxxxxxxxxxxxxxxxxx>
function getUser(rawUser) {
    if (!rawUser) return

	if (rawUser.startsWith('<@') && rawUser.endsWith('>')) {
		rawUser = rawUser.slice(2, -1)

		if (rawUser.startsWith('!')) {
			rawUser = rawUser.slice(1)
		}

		return client.users.cache.get(rawUser)
	}
}

// Get a random integer with a max value
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

// Start timer for autoDM's
setInterval(()=> {
    parseDMArray(dmArray)
}, dmInterval)

client.login(process.env.BOT_TOKEN)