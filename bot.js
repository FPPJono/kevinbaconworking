//bot requirements
const Discord = require('discord.js');
const bot = new Discord.Client();
const PREFIX = "!";
const PNG = require('pngjs')
var gifFrames = require('gif-frames')
const download = require('image-downloader')
var gameMessage = new Function('return true')
var PImage = require('pureimage');

//google sheets API connection
var request = require('request');
var cheerio = require('cheerio');
var Spreadsheet = require('edit-google-spreadsheet');

var google = require('googleapis');
var sheets = google.sheets('v4');
var fs = require('fs');
const readline = require('readline');
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
const TOKEN_PATH = 'credentials.json';

//Bot Code

//channels
const slurChannel = '421794351224455169'
const deleteEditChannel = '421839991929569281'
const warnChannel = '421794304059768852'
const suggestChannel = '423547474704072715'
const memesChannel = '421790539021811722'
const artChannel = '421790550778183701'
const announcements = '421770846915264526'
const welcome = '421790758933233664'
const banter = '421778879133384705'
const rules = '472372452605820928'
const botspam = '421789888929595407'

//roles
const admin = '421779825699848212'

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function basicEmbed(color, text) {
    var embed = { "description": `${text}`, "color": color };
    return embed
}

//lists
var eightBall = ["I would say..... yes!", "Probably not", "heck maybe, idk", "I dont think so", "eh, probably", "hmmm.... maybe not", "*concentrate*, and try again", "look man im just a bot go ask someone who cares", "those who ask will get their answer eventually, try again", "haha! yes!", "hah, nope"]
var coinFlip = ["The coin landed on heads!", "The coin landed on tails"]

function wait(ms) {
    var start = new Date().getTime();
    var end = start;
    while (end < start + ms) {
        end = new Date().getTime();
    }
}

function decimalToHexString(number) {
    if (number < 0) { number = 0xFFFFFFFF + number + 1 }
    return number.toString(16).toUpperCase();
}

function richEmbed(color, commands, descriptions, title) {
    var embed = {"color":color, "author":{"name":title}, "fields":[]}
    for (var i in commands) {
        embed.fields.push({"name": commands[i], "value": descriptions[i]})
    }
    return embed
}

async function welcomecard(person, guild) {
    if ((person.displayAvatarURL.includes("png"))||(person.displayAvatarURL.includes("jpg"))){
        await download.image({url: person.displayAvatarURL, dest:`welcomepfp.png`})
    }else if(person.displayAvatarURL.includes("gif")){
        await gifFrames({url:person.displayAvatarURL, frames:0, outputType: 'png'}).then(function(frameData){
            frameData[0].getImage().pipe(fs.createWriteStream(`welcomepfp.png`))
        })
    }
    PImage.decodePNGFromStream(fs.createReadStream(`baconbotwelcome.png`)).then((img) => {
        var size = (530 / person.username.toString().length)
        if (size > 40){
            size = 40
        }
        var img2 = PImage.make(500,250);
        var c = img2.getContext('2d');
        c.drawImage(img,
            0, 0, img.width, img.height, // source dimensions
            0, 0, 500, 250               // destination dimensions
        );
        var ctx = c
        var fnt = PImage.registerFont('scorefont.ttf', 'Score Font')
        fnt.load(() => {
            ctx.fillStyle = '#ffffff';
            ctx.font = `${size}pt 'Score Font'`;
            ctx.fillText(`${person.username}`, 134, 158);
            ctx.font = "20pt 'Score Font'";
            ctx.fillText(`Member #${guild.memberCount}`, 310, 207);
            PImage.decodePNGFromStream(fs.createReadStream(`welcomepfp.png`)).then((pfp) => {
                c.drawImage(pfp,
                    0, 0, pfp.width, pfp.height,
                    55, 44, 72, 72
                )
                PImage.encodePNGToStream(img2,fs.createWriteStream('welcome.png')).then(() => {
                    console.log(`${person.username} has just joined the server`);
                    guild.channels.get(welcome).send({files:[{attachment: 'welcome.png', name:'welcome.png'}] })
                    function message(channel){
                        channel.send(`Welcome <@${person.id}> to The Swag Pigs server!\nHere's a short list of channels you'll want to check out:\n<#${rules}> it's just the rules for the server but its important you know them\n<#${botspam}> the commands channel!\nFor a list of commands just do !commands\n<#${banter}> this is the general chat, its where most people can be found.`)
                    }
                    setTimeout(message, 100, guild.channels.get(welcome))
                });
            })
        });
    });
}

bot.on("guildMemberAdd", async member => {
    let guild = member.guild;
    welcomecard(member.user, guild)
    guild.channels.get(banter).send(`Welcome <@${member.id}> to the swag pigs server!`)
});

bot.on('ready', () => {
    console.log('I am ready!');
    bot.user.setPresence({ game: { name: 'I turned on !!', type: 0 } }); //playing game
    wait(5000)
    bot.user.setPresence({ game: { name: 'in some dirt', type: 0 } });
    bot.user.setUsername("Kevin Bacon");
});

bot.on('message', message => {
    var sender = message.author;
    if (message.author.bot) return;
    const args = message.content.split(" ");
    var announcement = bot.channels.get(announcements);
    let rip = message.content.toLowerCase()
    if (message.content.startsWith(PREFIX + "ping")) {
        message.channel.send(`Pong! ${new Date().getTime() - message.createdTimestamp}ms`)
    }
    if (rip.startsWith(PREFIX + "commands")) {
      if (rip.startsWith("!commands fun")) {
        let embed = basicEmbed(getRandomInt(16777215), "Fun Commands\n**!rate** rates something\n**!8ball** uses a magic 8ball\n**!coinflip** flips a coin\n**!randomhex** sends a random colour with the hex value of it")
        message.channel.send({embed})
      } else if (rip.startsWith("!commands staff")) {
        let embed = basicEmbed(getRandomInt(16777215), "Staff Commands\n**!send** sends a message\n**!clear** clears a certain amount of messages\n**!warn** warns a member\n**!playing** sets the playing status\n**!watching** sets the watching status")
        message.channel.send({embed})
      }else if (rip.startsWith("!commands dyno")) {
        let embed = basicEmbed(getRandomInt(16777215), "Dyno Commands\n**?google** searches google for specified thing\n**?rps** plays rock paper scissors with the bot\n**?serverinfo** displays info about the server\n**?membercount** says member count\nfor more dyno commands go here https://www.dynobot.net/commands")
        message.channel.send({embed})
      }else if (rip.startsWith("!commands info")){
        let embed = basicEmbed(getRandomInt(16777215), "Info Commands\n**!ping** pings the bot\n**!userinfo** gets information about your user")
        message.channel.send({embed})
      }else {
        let embed = basicEmbed(getRandomInt(16777215), "Command Categories\n**Fun**\n**Staff**\n**Dyno**\n**Info**\n**The Revolution**\nTo check a category, do !commands [category]\ncommands for all bots will be added to here over time")
        message.channel.send({embed})
      }
    }
    if (rip.startsWith(PREFIX + "playing")) {
        if (message.member.roles.has(admin)) {
            let content = args.join(" ")
            var useContent = content.substr(8);
            bot.user.setPresence({ game: { name: useContent, type: 0 } });
            console.log(`${sender.username} just changed the game to ${useContent}`)
        } else
            message.channel.send("sorry, that command is for admins only")
                .then(m => m.delete(5000));
    }

    if (rip.startsWith(PREFIX + "watching")) {
        if (message.member.roles.has(admin)) {
            let content = args.join(" ")
            var useContent = content.substr(9);
            bot.user.setPresence({ game: { name: useContent, type: 3 } });
            console.log(`${sender.username} just made the bot watching ${useContent}`)
        } else
            message.channel.send("sorry, that command is for admins only")
                .then(m => m.delete(5000));
    }
    if ((rip.includes("<@416446498264580096>")) || (rip.includes("<@!416446498264580096>"))) {
        message.channel.send("shut up");
    }
    if (rip.includes("bacon")) {
        message.react("🐷")
    }
    if (rip.includes("dab")) {
        message.react('380221447295205376')
    }
    if (rip.includes("spreadsheet")) {
        message.react('416071297920008192')
        message.channel.send("ha loser")
    }
    if (message.channel.id === artChannel) {
        let a = message.attachments.array().length;
        if (a >= 1) {
            message.react('👌')
        }
    }
    if (message.channel.id === memesChannel) {
        let a = message.attachments.array().length;
        if (a >= 1) {
            message.react('👌')
            message.react('👎')
        }
        if (rip.includes('http')) {
            message.react('👌')
            message.react('👎')
        }
    }
    if (message.content.startsWith(PREFIX + "randomhex")) {
        let color = getRandomInt(16777215)
        var embed = basicEmbed(color, `#${decimalToHexString(color)}`)
        message.channel.send({ embed });
    }

    //slur detection (not that great ngl)
    const swearWords = ["nigger", "chink", "tranny", "fag", "dyke", "nigga", "kike", "autist", "negroid", "dike"];
    var swearCheck = rip.replace(/\s/g, '')
    var swearCheck = rip.replace(/​/g, '').replace(/ /g, '').replace(/᠎/g, '')
    const byPass = ["halfaglass", "klondike", "warfage", "of a g"]
    if (swearWords.some(word => swearCheck.includes(word))) {
        if (byPass.some(word => swearCheck.includes(word))) return;
        if (byPass.some(word => rip.includes(word))) return;
        let guild = message.guild;
        let color = message.guild.member(message.author).displayColor
        message.delete()
        message.channel.send("Please refrain from using slurs. A copy of your message has been sent to the Admins.")
            .then(m => m.delete(7500));
        const embed = {
            "description": `${message.author.username} detected using slurs:\nMessage sent in channel #${message.channel.name}\nMessage sent by ${message.author.username} is below\n"${message.content}"`,
            "color": color,
            "thumbnail": {
                "url": `${message.author.avatarURL}`
            },
            "author": {
                "name": "The Slur Finder Machine",
                "icon_url": "https://cdn.discordapp.com/app-icons/416446498264580096/4f17fb88d33f4655d85154ee064f030d.png"
            }
        };
        guild.channels.get(slurChannel).send({ embed });
    }
    const hatewords = ["gay", "black", "homo"];
    var swearCheck = rip.replace(/\s/g, '')
    if (swearCheck.includes('hate')) {
        if (hatewords.some(word => swearCheck.includes(word))) {
            message.channel.send("this server is mostly jokes, please do not take offense to anything said.")
                .then(m => m.delete(15000));
        }
    }
    if (rip.startsWith('!headsup')){
        message.channel.send("this server is mostly jokes, please do not take offense to anything said.")
    }
    if (message.content.startsWith(PREFIX + "send")) {
        if (message.member.roles.has(admin)) {
            const sayMessage = args.join(" ");
            var useContent = sayMessage.substr(5);
            var attachments = (message.attachments).array()
            message.delete().catch(O_o => { })
            if (message.attachments.array().length >= 1) {
                message.channel.send(`${useContent}`)
                attachments.forEach(function (attachment) { message.channel.send({ file: `${attachment.url}` }) })
            }
            if (message.attachments.array().length <= 0) { message.channel.send(`${useContent}`) }
            message.channel.stopTyping()
        } else
            message.channel.send("sorry thats for admins only");
    }
    if (message.content.startsWith(PREFIX + "type")) {
        if (message.member.roles.has(admin)) {
            message.delete().catch(O_o => { })
            message.channel.startTyping()
        } else
            message.channel.send("sorry thats for admins only");
    }
    if (message.content.startsWith(PREFIX + "stoptype")) {
        if (message.member.roles.has(admin)) {
            message.delete().catch(O_o => { })
            message.channel.stopTyping()
        } else
            message.channel.send("sorry thats for admins only");
    }
    if (message.content.startsWith(PREFIX + "rate")) {
        const thingToRate = args.join(" ");
        var ratedThing = thingToRate.substr(5);
        var embed = basicEmbed(65535, `I would rate ${ratedThing} ${getRandomInt(10)} out of 10!`)
        message.channel.send({ embed });
    }
    if (message.content.startsWith(PREFIX + "clear")) {
        if (message.member.roles.has(admin)) {
            message.delete()
            let messagecount = parseInt(args[1]) || 1;
            if (messagecount > 100) return;
            if (messagecount < 2) return;
            message.channel.fetchMessages({ limit: Math.min(messagecount + 1, 100) })
            message.channel.bulkDelete(messagecount)
                .then(() => {
                    var embed = basicEmbed(123732, `:white_check_mark: Deleted ${messagecount} messages.`)
                    message.channel.send({ embed })
                        .then(m => m.delete(5000));
                })
        } else
            message.channel.send("sorry thats for admins only :/")
                .then(m => m.delete(5000));
    }
    if (message.content.startsWith(PREFIX + "8ball")) {
        if (args[1] != null) {
            var embed = basicEmbed(122353, `${eightBall[Math.floor(Math.random() * eightBall.length).toString(16)]}`)
            message.channel.send({ embed });
        } else message.channel.send("where is the question? \n```Correct usage: !8ball question```");
    }
    if (message.content.startsWith(PREFIX + "coinflip")) {
        var embed = basicEmbed(16776448, `${coinFlip[Math.floor(Math.random() * coinFlip.length).toString(16)]}`)
        message.channel.send({ embed });
    }
    if (message.content.startsWith(PREFIX + "warn")) {
        if (message.member.roles.has(admin)) {
            let guild = message.guild;
            let warning = message.content.substr(28)
            let color = message.guild.member(message.mentions.users.first()).displayColor
            guild.member(message.mentions.users.first()).send(`you have been warned for: \`${warning}\` Please improve your behaviour or you may be kicked or banned from this server in the future.`)
            const embed = {
                "description": `${message.mentions.users.first().username} has been warned for the reason below:\n${warning}`,
                "color": color,
                "thumbnail": {
                    "url": `${message.mentions.users.first().avatarURL}`
                },
                "author": {
                    "name": "The Warning Machine",
                    "icon_url": "https://cdn.discordapp.com/app-icons/416446498264580096/4f17fb88d33f4655d85154ee064f030d.png"
                }
            };
            guild.channels.get(warnChannel).send({ embed });
        } else message.channel.send("sorry that command is for admins only");
    }
    if (message.content.startsWith(PREFIX + "userinfo")) {
        let guild = message.guild;
        if (message.mentions.users.array().toString().length >= 1) {
            var person = message.mentions.users.first()
        } else {
            var person = message.author
        }
        let color = message.guild.member(person).displayColor
        const embed = {
            "color": color,
            "thumbnail": {
                "url": `${person.avatarURL}`
            },
            "author": {
                "name": `${person.username}`,
                "icon_url": `${person.avatarURL}`
            },
            "fields": [
                {
                    "name": "Display name",
                    "value": `${message.guild.member(person).displayName}`
                },
                {
                    "name": "User ID",
                    "value": `${person.id}`
                },
                {
                    "name": "Roles",
                    "value": `${message.guild.member(person).roles.array().toString().substr(0, 1024)}`
                },
                {
                    "name": "Top Role Color",
                    "value": `${message.guild.member(person).displayHexColor}`
                },
                {
                    "name": "Joined",
                    "value": `${message.guild.member(person).joinedAt.toUTCString()}`
                }
            ]
        };
        message.channel.send({ embed });
    }
    if (message.content.startsWith(PREFIX + "dm")) {
        if (message.member.roles.has(admin)) {
            let guild = message.guild;
            let content = message.content.substr(26)
            guild.member(message.mentions.users.first()).send(content)
            var attachments = (message.attachments).array()
            if (message.attachments.array().length >= 1) {
                attachments.forEach(function (attachment) { guild.member(message.mentions.users.first()).send({ file: `${attachment.url}` }) })
            }
        } else message.channel.send("sorry that command is for admins only");
    }
    if (message.content.startsWith(PREFIX + "suggest")) {
        let guild = message.guild;
        let suggestion = message.content.substr(8)
        let color = message.guild.member(message.author).displayColor
        message.delete()
        message.channel.send(`\`\`\`Thank you for your suggestion!\`\`\``)
            .then(m => m.delete(5000));
        const embed = {
            "description": `${message.author.username} has suggested the change/modification below:\n${suggestion}`,
            "color": color,
            "thumbnail": {
                "url": `${message.author.avatarURL}`
            },
            "author": {
                "name": "The Suggestion Box",
                "icon_url": "https://cdn.discordapp.com/app-icons/416446498264580096/4f17fb88d33f4655d85154ee064f030d.png"
            }
        };
        guild.channels.get(suggestChannel).send({ embed });
    }
    if (message.content.startsWith(PREFIX + "avatar")) {
        if (message.mentions.users.array().toString().length >= 1) {
            var pfp = message.mentions.users.first().avatarURL
            message.channel.send({ files: [{ attachment: pfp, name: `avatar${pfp.slice(0, -10).substr(pfp.slice(0, -10).length - 4)}` }] })
        } else {
            var pfp = message.author.avatarURL
            message.channel.send({ files: [{ attachment: pfp, name: `avatar${pfp.slice(0, -10).substr(pfp.slice(0, -10).length - 4)}` }] })
        }
    }
    if (message.content.startsWith(PREFIX + "morse")) {
        var chars = { ' ': '/', 'a': '.- ', 'b': '-... ', 'c': '-.-. ', 'd': '-.. ', 'e': '. ', 'f': '..-. ', 'g': '--. ', 'h': '.... ', 'i': '.. ', 'j': '.--- ', 'k': '-.- ', 'l': '.-.. ', 'm': '-- ', 'n': '-. ', 'o': '--- ', 'p': '.--. ', 'q': '--.- ', 'r': '.-. ', 's': '... ', 't': '- ', 'u': '..- ', 'v': '...- ', 'w': '.-- ', 'x': '-..- ', 'y': '-.-- ', 'z': '--.. ', '1': '.---- ', '2': '..--- ', '3': '...-- ', '4': '....- ', '5': '..... ', '6': '-.... ', '7': '--... ', '8': '---.. ', '9': '----. ', '0': '----- ' };
        var s = rip.substr(7);
        s = s.replace(/[abcdefghijklmnopqrstuvwxyz1234567890 ]/g, m => chars[m]);
        message.channel.send(`${s}`)
    }
    if (message.content.startsWith(PREFIX + "emote")) {
        var chars = { ' ': '⬜', 'a': '🅰 ', 'b': '🅱 ', 'c': '🇨 ', 'd': '🇩 ', 'e': '🇪 ', 'f': '🇫 ', 'g': '🇬 ', 'h': '🇭 ', 'i': '🇮 ', 'j': '🇯 ', 'k': '🇰 ', 'l': '🇱 ', 'm': '🇲 ', 'n': '🇳 ', 'o': '🅾 ', 'p': '🇵 ', 'q': '🇶 ', 'r': '🇷 ', 's': '🇸 ', 't': '🇹 ', 'u': '🇺 ', 'v': '🇻 ', 'w': '🇼 ', 'x': '🇽 ', 'y': '🇾 ', 'z': '🇿 ' };
        var s = rip.substr(7);
        s = s.replace(/[abcdefghijklmnopqrstuvwxyz ]/g, m => chars[m]);
        message.channel.send(`${s}`)
    }

});

bot.on('message', async message => {
    //staffapp
    let staffApps = []
    let rip = message.content.toLowerCase()
    if (rip.startsWith("!apply")) {
        if (staffApps.includes(message.author.id)) return message.channel.send("you have already sent in an application, you cannot do this more than once")
        staffApps.push(message.author.id, {"question":1, "answer1":"", "answer2":"", "answer3":"", "answer4":"", "answer5":"", "answer6":"", "answer7":"", "answer8":""})
        message.author.send("You are applying to become staff on the Swag Pigs server, first off please tell us a little about yourself")
    }
    if (message.channel.type === "dm") {
      if (staffApps[staffApps.indexOf(message.author.id)+ 1].question === 1) {
        staffApps[staffApps.indexOf(message.author.id) + 1].answer1 = message.content.substr(0, 1024)
        message.author.send("what are your biggest weaknesses?")
        staffApps[staffApps.indexOf(message.author.id)+ 1].question = 2
      }else if (staffApps[staffApps.indexOf(message.author.id)+ 1].question === 2) {
        staffApps[staffApps.indexOf(message.author.id) + 1].answer2 = message.content.substr(0, 1024)
        message.author.send("what are your biggest strengths?")
        staffApps[staffApps.indexOf(message.author.id) + 1].question = 3
      }else if (staffApps[staffApps.indexOf(message.author.id)+ 1].question === 3) {
        staffApps[staffApps.indexOf(message.author.id) + 1].answer3 = message.content.substr(0, 1024)
        message.author.send("out of all the other candidates, why should we choose you?")
        staffApps[staffApps.indexOf(message.author.id) + 1].question = 4
      }else if (staffApps[staffApps.indexOf(message.author.id)+ 1].question === 4) {
        staffApps[staffApps.indexOf(message.author.id) + 1].answer4 = message.content.substr(0, 1024)
        message.author.send("why do you want this job?")
        staffApps[staffApps.indexOf(message.author.id) + 1].question = 5
      }else if (staffApps[staffApps.indexOf(message.author.id)+ 1].question === 5) {
        staffApps[staffApps.indexOf(message.author.id) + 1].answer5 = message.content.substr(0, 1024)
        message.author.send("What is your leadership style?")
        staffApps[staffApps.indexOf(message.author.id) + 1].question = 6
      }else if (staffApps[staffApps.indexOf(message.author.id)+ 1].question === 6) {
        staffApps[staffApps.indexOf(message.author.id) + 1].answer6 = message.content.substr(0, 1024)
        message.author.send("Tell me how you think other people would describe you.")
        staffApps[staffApps.indexOf(message.author.id) + 1].question = 7
      }else if (staffApps[staffApps.indexOf(message.author.id)+ 1].question === 7) {
        staffApps[staffApps.indexOf(message.author.id) + 1].answer7 = message.content.substr(0, 1024)
        message.author.send("How would you go about punishing a member who has done something wrong?")
        staffApps[staffApps.indexOf(message.author.id) + 1].question = 8
      }else if (staffApps[staffApps.indexOf(message.author.id)+ 1].question === 8) {
        staffApps[staffApps.indexOf(message.author.id) + 1].answer8 = message.content.substr(0, 1024)
        message.author.send("Thank you for entering your application, staff will look through it soon and once all have been checked, our new staff members will be announced")
        staffApps[staffApps.indexOf(message.author.id) + 1].question = 9
        bot.guilds.get("421770342361464833").channels.get("480921669851021352").send(staffApps[staffApps.indexOf(message.author.id)+ 1])
      }else {
        var chars = { ' ': '/', 'a': '.- ', 'b': '-... ', 'c': '-.-. ', 'd': '-.. ', 'e': '. ', 'f': '..-. ', 'g': '--. ', 'h': '.... ', 'i': '.. ', 'j': '.--- ', 'k': '-.- ', 'l': '.-.. ', 'm': '-- ', 'n': '-. ', 'o': '--- ', 'p': '.--. ', 'q': '--.- ', 'r': '.-. ', 's': '... ', 't': '- ', 'u': '..- ', 'v': '...- ', 'w': '.-- ', 'x': '-..- ', 'y': '-.-- ', 'z': '--.. ', '1': '.---- ', '2': '..--- ', '3': '...-- ', '4': '....- ', '5': '..... ', '6': '-.... ', '7': '--... ', '8': '---.. ', '9': '----. ', '0': '----- ' };
        var s = rip
        s = s.replace(/[abcdefghijklmnopqrstuvwxyz1234567890 ]/g, m => chars[m]);
        message.channel.send(`${s}`)
        return
      }
    }
});


//Reaction Handling

function reactionRoleToggle(channel, roleid, emoji, reaction, user, roles) {
    if (reaction.emoji.name === emoji) {
        if (user.bot) return;
        let guild = reaction.message.guild;
        let member = guild.member(user);
        if (reaction.message.channel != bot.channels.get(channel)) {
            return;
        }
        member.removeRoles(roles).then(member.addRole(roleid))
    }
}

//Delete Edit Log Code
bot.on('messageUpdate', (omsg, nmsg) => {
    if (omsg.author.bot) return;
    if (omsg.content === nmsg.content) return;
    console.log(`${omsg.author.username} just edited their message`);
    let guild = omsg.guild;
    let color = guild.member(omsg.author).displayColor
    var attachments = (omsg.attachments).array()
    if (omsg.attachments.array().length >= 1) {
        var embed = {
            "title": `${omsg.author.username} just edited their message`,
            "description": `Message sent in channel #${omsg.channel.name}`,
            "color": color,
            "thumbnail": {
                "url": `${omsg.author.avatarURL}`
            },
            "image": {
                "url": `${attachments[0].url}`
            },
            "author": {
                "name": "The Magical Edit Searcher",
                "icon_url": "https://cdn.discordapp.com/app-icons/416446498264580096/4f17fb88d33f4655d85154ee064f030d.png"
            },
            "fields": [
                {
                    "name": "Original message:",
                    "value": `${omsg.content.substr(0, 1024)}`
                },
                {
                    "name": "New Message:",
                    "value": `${nmsg.content.substr(0, 1024)}`
                },
                {
                    "name": "Attached Image",
                    "value": `Link: ${attachments[0].url}`
                }
            ]
        }
    }
    if (omsg.attachments.array().length <= 0) {
        var embed = {
            "title": `${omsg.author.username} just edited their message`,
            "description": `Message sent in channel #${omsg.channel.name}`,
            "color": color,
            "thumbnail": {
                "url": `${omsg.author.avatarURL}`
            },
            "author": {
                "name": "The Magical Edit Searcher",
                "icon_url": "https://cdn.discordapp.com/app-icons/416446498264580096/4f17fb88d33f4655d85154ee064f030d.png"
            },
            "fields": [
                {
                    "name": "Original message:",
                    "value": `${omsg.content.substr(0, 1024)}`
                },
                {
                    "name": "New Message:",
                    "value": `${nmsg.content.substr(0, 1024)}`
                }
            ]
        }
    }
    guild.channels.get(deleteEditChannel).send({ embed });
});

bot.on('messageDelete', message => {
    let guild = message.guild;
    if (message.author.bot) return;
    if ((message.content.startsWith('!clear')) || (message.content.startsWith('!send')) || (message.content.startsWith('!warn')) || (message.content.startsWith('!suggest')) || (message.content.startsWith('!type')) || (message.content.startsWith('!stoptype'))) return;
    const swearWords = ["nigger", "chink", "tranny", "fag", "dyke", "nigga", "kike", "autist", "negroid", "dike"];
    let rip = message.content.toLowerCase()
    var swearCheck = rip.replace(/\s/g, '')
    if (swearWords.some(word => swearCheck.includes(word))) return;
    console.log(`${message.author} just deleted their message`)
    let color = message.guild.member(message.author).displayColor
    var attachments = (message.attachments).array()
    if (message.attachments.array().length >= 1) {
        var embed = {
            "title": `${message.author.username} just deleted their message`,
            "description": `Message sent in channel #${message.channel.name}`,
            "color": color,
            "thumbnail": {
                "url": `${message.author.avatarURL}`
            },
            "image": {
                "url": `${attachments[0].url}`
            },
            "author": {
                "name": "The Delete Scanner",
                "icon_url": "https://cdn.discordapp.com/app-icons/416446498264580096/4f17fb88d33f4655d85154ee064f030d.png"
            },
            "fields": [
                {
                    "name": "Original message:",
                    "value": `${message.content.substr(0, 1024)}`
                },
                {
                    "name": "Attached Image",
                    "value": `Link: ${attachments[0].url}`
                }
            ]
        }
    }
    if (message.attachments.array().length <= 0) {
        var embed = {
            "title": `${message.author.username} just deleted their message`,
            "description": `Message sent in channel #${message.channel.name}`,
            "color": color,
            "thumbnail": {
                "url": `${message.author.avatarURL}`
            },
            "author": {
                "name": "The Delete Scanner",
                "icon_url": "https://cdn.discordapp.com/app-icons/416446498264580096/4f17fb88d33f4655d85154ee064f030d.png"
            },
            "fields": [
                {
                    "name": "Original message:",
                    "value": `${message.content.substr(0, 1024)}`
                }
            ]
        }
    }
    guild.channels.get(deleteEditChannel).send({ embed });
});

//timeRoles

const correctchannel = "447967753639297025"

bot.on('ready', () => {
    bot.channels.get(correctchannel).send("test")
    bot.channels.get(correctchannel).bulkDelete(3)
    const embed = { "description": "```To get a timezone role,\njust react to this message with the emote\nthats next to the time zone role you want```", "color": 965737, "fields": [{ "name": ":regional_indicator_a:", "value": "AZ (UTC - 7)" }, { "name": ":regional_indicator_b:", "value": "Central Time (UTC - 6)" }, { "name": ":regional_indicator_c:", "value": "NZ (UTC + 12)" }, { "name": ":regional_indicator_d:", "value": "PST (UTC - 8)" }] };
    bot.channels.get(correctchannel).send({ embed })
        .then(function (message) {
            message.react("🇦")
            message.react("🇧")
            message.react("🇨")
            message.react("🇩")
        });
    bot.channels.get(correctchannel).send("if your time zone isnt here,please send it in <#425570477281378305>")
});

bot.on('messageReactionAdd', async (reaction, user) => {
    reactionRoleToggle(correctchannel, '447978247695892499', "🇦", reaction, user, ['447979856710336513','447970716953083925','447983013758894100'])
    reactionRoleToggle(correctchannel, '447979856710336513', "🇧", reaction, user, ['447978247695892499','447970716953083925','447983013758894100'])
    reactionRoleToggle(correctchannel, '447970716953083925', "🇨", reaction, user, ['447978247695892499','447979856710336513','447983013758894100'])
    reactionRoleToggle(correctchannel, '447983013758894100', "🇩", reaction, user, ['447978247695892499','447979856710336513','447970716953083925'])
});

// Sneaky Sneaky Token. Dont Share Kiddos
bot.login(process.env.BOT_TOKEN);
