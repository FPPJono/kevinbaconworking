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

var staffApps = []

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
const dagsex = '458911167780356105'
const alexchat = '487117145667534868'
const staffapps = '480921669851021352'
const testchannel = "421794402986360832"
const timezone = '447967753639297025'

const swagpigs = '421770342361464833'

const alex = '377819024916086784'

//roles
const admin = '421779825699848212'
const mod = '481264368512663562'
const freegames = '482350831451111437'
const announcerole = '482350698777018388'

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

function pfpEmbed(color, commands, descriptions, title, pfpurl) {
    var embed = {"color":color, "author":{"name":title}, "fields":[], "thumbnail":{"url":pfpurl}}
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

const events = {
    MESSAGE_REACTION_ADD: 'messageReactionAdd',
    MESSAGE_REACTION_REMOVE: 'messageReactionRemove',
};
bot.on('raw', async event => {
    if (!events.hasOwnProperty(event.t)) return;
    const { d: data } = event;
    const user = bot.users.get(data.user_id);
    const channel = bot.channels.get(data.channel_id) || await user.createDM();
    if (channel.messages.has(data.message_id)) return;
    const message = await channel.fetchMessage(data.message_id);
    const emojiKey = (data.emoji.id) ? `${data.emoji.name}:${data.emoji.id}` : data.emoji.name;
    const reaction = message.reactions.get(emojiKey);
    bot.emit(events[event.t], reaction, user);
});

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
    bot.channels.get(testchannel).send("`bot restarted`")
});

bot.on('message', message => {
    var sender = message.author;
    if (message.author.bot) return;
    const args = message.content.split(" ");
    let guild = message.guild
    if ((message.channel.type === "dm")&&(message.author.id === alex)) {
        if (message.content.startsWith('!')) {
            return
        } else {
            bot.guilds.get(swagpigs).channels.get(alexchat).send(message.content)
        }
    }
    if (message.channel.id === alexchat) {
        guild.members.get(alex).send(message.content)
        var attachments = (message.attachments).array()
        if (message.attachments.array().length >= 1) {
            attachments.forEach(function (attachment) { guild.members.get(alex).send({ file: `${attachment.url}` }) })
        }else if (message.attachments.array().length <= 0) return
    }
    var announcement = bot.channels.get(announcements);
    let rip = message.content.toLowerCase()
    if (message.content.startsWith(PREFIX + "ping")) {
        message.channel.send(`Pong! ${new Date().getTime() - message.createdTimestamp}ms`)
    }
    if (rip.startsWith(PREFIX + "commands")) {
      if (rip.startsWith("!commands fun")) {
        let embed = richEmbed(getRandomInt(16777215), ["!rate", "!8ball", "!coinflip", "!randomhex"], ["rates something", "uses a magic 8ball", "flips a coin and tells you the result", "sends a random colour and it's hex value"], "Fun Commands")
        message.channel.send({embed})
      } else if (rip.startsWith("!commands staff")) {
        let embed = richEmbed(getRandomInt(16777215), ["!send", "!delete", "!warn", "!playing", "!watching", "!listening", "!apply", "!dm"], ["send a message through me", "delete an amount of messages from 2-100", "send a warning to a member", "set the playing status for the bot", "set the watching status for the bot", "set the listening status for the bot", "apply to become a staff member", "send a dm to a user with the bot"], "Staff Commands")
        message.channel.send({embed})
      }else if (rip.startsWith("!commands info")){
        let embed = richEmbed(getRandomInt(16777215), ["!ping", "!userinfo"], ["pings the bot","sends information about a user"], "Info Commands")
        message.channel.send({embed})
      }else if (rip.startsWith("!commands roles")){
        let embed = richEmbed(getRandomInt(16777215), ["!announcements", "!freegames"], ["pings you in all important server announcements","pings you in all announcements about free games"], "Role Commands")
        message.channel.send({embed})
      }else {
        let embed = richEmbed(getRandomInt(16777215), "Command Categories\n**Fun**\n**Staff**\n**Dyno**\n**Info**\n**Roles**\nTo check a category, do !commands [category]\ncommands for all bots will be added to here over time")
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
    if (rip.startsWith("!listening")) {
        if (message.member.roles.has(admin)) {
            var useContent = rip.substr(10);
            bot.user.setPresence({ game: { name: useContent, type: 2 } });
            console.log(`${sender.username} just changed made me listening to to ${useContent}`)
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
    if (message.channel.id === artChannel) {
        let a = message.attachments.array().length;
        if (a >= 1) {
            message.react('👌')
        }
    }
    if ((message.channel.id === dagsex)||(message.channel.id === memesChannel)) {
        let a = message.attachments.array().length;
        if ((a >= 1)||(rip.includes('http'))) {
            message.react('👌')
            message.react('👎')
        }
    }
    if (message.content.startsWith(PREFIX + "randomhex")) {
        let color = getRandomInt(16777215)
        var embed = basicEmbed(color, `#${decimalToHexString(color)}`)
        message.channel.send({ embed });
    }

    if (message.content.startsWith(PREFIX + "send")) {
        if ((message.member.roles.has(admin))||(message.member.roles.has(mod))) {
            const sayMessage = args.join(" ");
            var useContent = sayMessage.substr(5);
            var attachments = (message.attachments).array()
            message.delete().catch(O_o => { })
            if (message.attachments.array().length >= 1) {
                message.channel.send(`${useContent}`)
                attachments.forEach(function (attachment) { message.channel.send({ file: `${attachment.url}` }) })
            }else if (message.attachments.array().length <= 0) { message.channel.send(`${useContent}`) }
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
    if (rip.startsWith('!announcements')) {
        if (message.member.roles.has(announcerole)) {
            message.member.removeRole(announcerole)
            message.channel.send("```You will no longer be pinged in any announcements posts```")
        } else {
            message.member.addRole(announcerole)
            message.channel.send("```You will now be pinged in all important announcements posts```")
        }
    }
    if (rip.startsWith('!freegames')) {
        if (message.member.roles.has(freegames)) {
            message.member.removeRole(freegames)
            message.channel.send("```You will no longer be pinged in any posts about free games```")
        } else {
            message.member.addRole(freegames)
            message.channel.send("```You will now be pinged in all posts about free games```")
        }
    }
    if (message.content.startsWith(PREFIX + "delete")) {
        if ((message.member.roles.has(admin))||(message.member.roles.has(mod))) {
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
        if ((message.member.roles.has(admin))||(message.member.roles.has(mod))) {
            if (message.mentions.users.array().toString().length >=1) {
                var person = message.mentions.users.first()
            } else return;
            let guild = message.guild;
            let warning = message.content.substr(28)
            let color = message.guild.member(person).displayColor
            guild.member(person).send(`you have been warned for: \`${warning}\` Please improve your behaviour or you may be kicked or banned from this server in the future.`)
            var embed = pfpEmbed(color, ["User was warned for:", "Warned by:", "Warned in channel:"], [`${warning}`,`<@${message.author.id}>`, `<#${message.channel.id}>`], `${person.username} has received a warning`, `${person.avatarURL}`)
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
        var embed = pfpEmbed(color, ["Display Name", "User ID", "Roles", "Top Role Colour", "Joined"], [`${message.guild.member(person).displayName}`,`${person.id}`,`${message.guild.member(person).roles.array().toString().substr(0, 1024)}`,`${message.guild.member(person).displayHexColor}`,`${message.guild.member(person).joinedAt.toUTCString()}`], `Info About ${person.username}`, `${person.avatarURL}`)
        message.channel.send({ embed });
    }
    if (message.content.startsWith(PREFIX + "dm")) {
        if ((message.member.roles.has(admin))||(message.member.roles.has(mod))) {
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
        var embed = pfpEmbed(color, ["Suggestion:"], [`${suggestion.substr(0, 1024)}`], `${message.author.username} has suggested the following`, `${message.author.avatarURL}`)
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
    let rip = message.content.toLowerCase()
    if (message.author.bot) return;
    if (message.channel.type === "dm") {
        if(staffApps.includes(message.author.id)) {
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
                var questions = ["tell us a little bit about yourself", "what are your biggest weaknesses", "what are your biggest strengths", "why should we choose you", "why do you want this job", "what is your leadership style", "how would others describe you", "how would you punish someone"]
                var personObj = staffApps[staffApps.indexOf(message.author.id) + 1]
                var answers = [personObj.answer1, personObj.answer2, personObj.answer3, personObj.answer4, personObj.answer5, personObj.answer6, personObj.answer7, personObj.answer8]
                var embed = richEmbed(getRandomInt(16777215), questions, answers, `Application from ${message.author.username}`)
                bot.guilds.get(alexchat).channels.get(staffapps).send({embed})
            }else {
                var chars = { ' ': '/', 'a': '.- ', 'b': '-... ', 'c': '-.-. ', 'd': '-.. ', 'e': '. ', 'f': '..-. ', 'g': '--. ', 'h': '.... ', 'i': '.. ', 'j': '.--- ', 'k': '-.- ', 'l': '.-.. ', 'm': '-- ', 'n': '-. ', 'o': '--- ', 'p': '.--. ', 'q': '--.- ', 'r': '.-. ', 's': '... ', 't': '- ', 'u': '..- ', 'v': '...- ', 'w': '.-- ', 'x': '-..- ', 'y': '-.-- ', 'z': '--.. ', '1': '.---- ', '2': '..--- ', '3': '...-- ', '4': '....- ', '5': '..... ', '6': '-.... ', '7': '--... ', '8': '---.. ', '9': '----. ', '0': '----- ' };
                var s = rip
                s = s.replace(/[abcdefghijklmnopqrstuvwxyz1234567890 ]/g, m => chars[m]);
                message.channel.send(`${s}`)
                return
            }
        }else if (message.author.id === alex) {
            return
        } else{
            var chars = { ' ': '/', 'a': '.- ', 'b': '-... ', 'c': '-.-. ', 'd': '-.. ', 'e': '. ', 'f': '..-. ', 'g': '--. ', 'h': '.... ', 'i': '.. ', 'j': '.--- ', 'k': '-.- ', 'l': '.-.. ', 'm': '-- ', 'n': '-. ', 'o': '--- ', 'p': '.--. ', 'q': '--.- ', 'r': '.-. ', 's': '... ', 't': '- ', 'u': '..- ', 'v': '...- ', 'w': '.-- ', 'x': '-..- ', 'y': '-.-- ', 'z': '--.. ', '1': '.---- ', '2': '..--- ', '3': '...-- ', '4': '....- ', '5': '..... ', '6': '-.... ', '7': '--... ', '8': '---.. ', '9': '----. ', '0': '----- ' };
            var s = rip
            s = s.replace(/[abcdefghijklmnopqrstuvwxyz1234567890 ]/g, m => chars[m]);
            message.channel.send(`${s}`)
            return
        } 
    }
    if (rip.startsWith("!apply")) {
        if (staffApps.includes(message.author.id)) return message.channel.send("you have already sent in an application, you cannot do this more than once")
        staffApps.push(message.author.id, {"question":1, "answer1":"", "answer2":"", "answer3":"", "answer4":"", "answer5":"", "answer6":"", "answer7":"", "answer8":""})
        message.author.send(`You are applying to become staff on the Swag Pigs server, first off please tell us a little about yourself`)
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


//timeRoles
bot.on('messageReactionAdd', async (reaction, user) => {
    reactionRoleToggle(timezone, '447978247695892499', "🇦", reaction, user, ['447979856710336513','447970716953083925','447983013758894100'])
    reactionRoleToggle(timezone, '447979856710336513', "🇧", reaction, user, ['447978247695892499','447970716953083925','447983013758894100'])
    reactionRoleToggle(timezone, '447970716953083925', "🇨", reaction, user, ['447978247695892499','447979856710336513','447983013758894100'])
    reactionRoleToggle(timezone, '447983013758894100', "🇩", reaction, user, ['447978247695892499','447979856710336513','447970716953083925'])
});

// Sneaky Sneaky Token. Dont Share Kiddos
bot.login(process.env.BOT_TOKEN);
