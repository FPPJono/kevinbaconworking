//bot requirements
const Discord = require('discord.js');
const ytdl = require('ytdl-core')
const ffmpeg = require('ffmpeg-binaries')
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
/*
fs.readFile('client_secret.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Sheets API.
  authorize(JSON.parse(content), listMajors);
});

function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return callback(err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

function listMajors(auth) {
  const sheets = google.sheets({version: 'v4', auth});
  sheets.spreadsheets.values.get({
    spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
    range: 'Class Data!A2:E',
  }, (err, {data}) => {
    if (err) return console.log('The API returned an error: ' + err);
    const rows = data.values;
    if (rows.length) {
      console.log('Name, Major:');
      // Print columns A and E, which correspond to indices 0 and 4.
      rows.map((row) => {
        console.log(`${row[0]}, ${row[4]}`);
      });
    } else {
      console.log('No data found.');
    }
  });
}

authorize(function(authClient) {
  var request = {
    spreadsheetId: '1LAT5fQd7lOsH_tQyCleufWLCMua6MGHRDAjxqpz0AOI',
    range: 'Sheet1',
    auth: authClient,
  };

  sheets.spreadsheets.values.get(request, function(err, response) {
    if (err) {
      console.error(err);
      return;
    }

    // TODO: Change code below to process the `response` object:
    console.log(JSON.stringify(response, null, 2));
  });
});

function authorize(callback) {
  // TODO: Change placeholder below to generate authentication credentials. See
  // https://developers.google.com/sheets/quickstart/nodejs#step_3_set_up_the_sample
  //
  // Authorize using one of the following scopes:
  //   'https://www.googleapis.com/auth/drive'
  //   'https://www.googleapis.com/auth/drive.file'
  //   'https://www.googleapis.com/auth/drive.readonly'
  //   'https://www.googleapis.com/auth/spreadsheets'
  //   'https://www.googleapis.com/auth/spreadsheets.readonly'
  var authClient = 'https://www.googleapis.com/auth/spreadsheets.readonly'

  if (authClient == null) {
    console.log('authentication failed');
    return;
  }
  callback(authClient);
}
*/
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

async function welcomecard(person, guild) {
    if ((person.displayAvatarURL.includes("png"))||(person.displayAvatarURL.includes("jpg"))){
        await download.image({url: person.displayAvatarURL, dest:`welcomepfp.png`})
    }else if(person.displayAvatarURL.includes("gif")){
        await gifFrames({url:person.displayAvatarURL, frames:0, outputType: 'png'}).then(function(frameData){
            frameData[0].getImage().pipe(fs.createWriteStream(`welcomepfp.png`))
        })
    }
    PImage.decodePNGFromStream(fs.createReadStream(`welcomeCard.png`)).then((img) => {
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
                    52, 44, 72, 72
                )
                PImage.encodePNGToStream(img2,fs.createWriteStream('welcome.png')).then(() => {
                    console.log(`${person.username} has just joined the server`);
                    guild.channels.get(welcome).send({files:[{attachment: 'welcome.png', name:'welcome.png'}] })
                    function message(channel){
                        channel.send(`Welcome <@${person.id}> to The Swag Pigs server!\nHere's a short list of channels you'll want to check out:\n<#${rules}> it's just the rules for the server but its important you know them\n<#${botspam}> the commands channel!\nFor a list of commands just do !help\n<#${banter}> this is the general chat, its where most people can be found.`)
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
        let embed = basicEmbed(getRandomInt(16777215), "Command Categories\n**Fun**\n**Staff**\n**Dyno**\n**Info**\nTo check a category, do !commands [category]\ncommands for all bots will be added to here over time")
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
    //Music bot commands

    if (message.content.startsWith(`${PREFIX}play`)) {
        const voiceChannel = message.member.voiceChannel
        if (!voiceChannel) return message.channel.send("you must be in a voice channel to use this command")
        const permissions = voiceChannel.permissionsFor(message.client.user)
        if (!permissions.has('CONNECT')) {
            return message.channel.send("I cannot connect to that voice channel")
        }
        if (!permissions.has('SPEAK')) {
            return message.channel.send('I cannot speak in this voice channel, check my permissions and try again')
        }
        try {
            var connection = await voiceChannel.join()
        } catch (error) {
            console.log(`I could not join the voice channel: ${error}`)
        }
        voiceChannel.join()
            .then(connection => {
                const stream = ytdl('https://www.youtube.com/watch?v=b3hvAOb8arY', { filter: 'audioonly' })
                const dispatcher = connection.playStream(stream)
            })
    }
    if (message.content.startsWith(`${PREFIX}leave`)) {
        message.member.voiceChannel.leave()
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
