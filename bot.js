const Discord = require('discord.js');
const bot = new Discord.Client();
const PREFIX = "!";
var gameMessage = new Function('return true')

const slurChannel = '416067707851505664'

function getRandomInt (max) {
    return Math.floor(Math.random() * Math.floor(max));
}

var eightBall = [
    "```I would say..... yes!```",
    "```Probably not```",
    "```maybe?```",
    "```I dont think so```",
    "```probably```"
]

bot.on('ready', () => {
    console.log('I am ready!');
    bot.user.setPresence({ game: { name: 'I turned on !!', type: 0 } }); //playing game
    //bot.setTimeout(gameMessage(), 5000);
    bot.user.setPresence({ game: { name: "in some dirt", type: 0}});
});

bot.on("message", async message => {
     const args = message.content.slice(PREFIX.length).trim().split(/ +/g);
     if (message.content === '!ping') {
        const m = await message.channel.send("Ping?");
        m.edit(`Pong! ${m.createdTimestamp - message.createdTimestamp}ms.`);   	
  	}
    if(message.content.startsWith(PREFIX + "send")) {
        if (message.member.roles.has("269993616456417280")) {
            const sayMessage = args.join(" ");
            var useContent = sayMessage.substr(5);
            message.delete().catch(O_o=>{}); 
            message.channel.send(useContent);
        }else
            message.channel.send("sorry thats for admins only");
    }
    if (message.content.startsWith(PREFIX + "rate")){
        const thingToRate = args.join(" ");
        var ratedThing = thingToRate.substr(5);
        const embed = {
            "description": `I would rate ${ratedThing} ${getRandomInt(10)} out of 10!`,
            "url": "https://discordapp.com",
            "color": 122353,
            "footer": {
                "icon_url": "https://cdn.discordapp.com/app-icons/416446498264580096/4f17fb88d33f4655d85154ee064f030d.png",
                "text": "Copyright Jono's Jontronics Ltd. 2097"
            }
            };
            message.channel.send({ embed });
                }
});

bot.on('message', message => {
    var sender = message.author;
    if(message.author.bot) return;
    var args = message.content.substring(PREFIX.length).split(" ");
    var announcement = bot.channels.find("name", "announcements");
    let rip = message.content.toLowerCase()
    if (message.content.startsWith(PREFIX + "announce")) {
         if (message.member.roles.has("269993616456417280")) {
            let content = args.join(" ")
            var useContent = content.substr(9);
            announcement.send(useContent)
            console.log(`${sender.username} just announced ${useContent}.`)
        }else
            message.author.send("sorry, that command is for admins only")
    }
    if (message.content.startsWith(PREFIX + "playing")) {
         if (message.member.roles.has("269993616456417280")) {
            let content = args.join(" ")
            var useContent = content.substr(8);
            bot.user.setPresence({ game: { name: useContent, type: 0 } });
            console.log(`${sender.username} just changed the game to ${useContent}`)
        }else
            message.author.send("sorry, that command is for admins only")
    }
    if (message.content.startsWith(PREFIX + "welcome")) {
        var welcome = bot.channels.find("name", "welcome");
        welcome.bulkDelete(99)
        welcome.send("Welcome to the Swag Pigs Server!\nBy clicking the ✅ button below, you agree to all the rules stated in <#269998962717491201>.\nOnce you have hit the checkmark, go ahead to <#269990219665637377> to say hi to everyone, and check out the other channel topics we have on the server! 🐷")
            .then(function (message) {
        message.react("✅")
                });
    }
    if (message.content.includes("<@416446498264580096>")) {
        message.channel.send("shut up");
    }
    if (message.content.includes("Bacon")) {
       message.react("🐷")
    }
    if (message.content.includes("dab")) {
        message.react('380221447295205376')
    }
    if (rip.includes("spreadsheet")) {
        message.react('416071297920008192')
        message.channel.send("ha loser")
    }
    //if (message.content.startsWith(PREFIX + "piglet")) {
      //  let role = message.guild.roles.find("name", "Piglet");
        //let member = message.author;
        //member.addRole(role).catch(console.error);
    //}
    const swearWords = ["nigger", "chink", "tranny", "fag", "dyke", "nigga", "kike", "retard", "autist"];
    if( swearWords.some(word => rip.includes(word)) ) {
        let guild = message.guild;
        message.delete()
        message.channel.send("Please refrain from using slurs. A copy of your message has been sent to the Admins.")
            .then(m => m.delete(7500));
        guild.channels.get(slurChannel).send("```" + message.author.username + " detected using slurs: \"" + message.content + "\"```")
    }
    if (message.content.includes(PREFIX + "clear")) {
        if (message.member.roles.has("269993616456417280")) {
            let messagecount = parseInt(args[1]) || 1;
            message.channel.fetchMessages({limit: Math.min(messagecount + 1, 100)})
            message.channel.bulkDelete(messagecount)
            .then(() => {
                    message.channel.send(`:white_check_mark: Deleted \`${messagecount}\` messages.`)
                        .then(m => m.delete(2000));
            }).catch(console.error);
        }else
            message.channel.send("sorry thats for admins only :/");
    }
    
});



// THIS  MUST  BE  THIS  WAY
bot.login(process.env.BOT_TOKEN);


//bot.on('message', message => {
  //  var sender = message.author;
    
    //allows custom commands
    //var args = message.content.substring(PREFIX.length).split(" ");
    //var announcement = bot.channels.find("name", "announcements");
    

//bot.login(process.env.BOT_TOKEN);

    
    //member.addRole(member.guild.roles.find("name", "INSERTNAMEOFROLE"))
