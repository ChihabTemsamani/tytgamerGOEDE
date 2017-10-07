const Discord = require("discord.js"); // this imports discord.js

const PREFIX = "*"; // this sets the bot prefix, change it to whatever you want

var eightball = [ // this creates an Array, a list with all the possible answerrs to the 8ball command (see below for 8ball command)
    "yes!",
    "no...",
    "maybe?",
    "probably",
    "I don't think so.",
    "never!",
    "you can try...",
    "up to you!",
];

var bot = new Discord.Client(); // sets the module Discord.Client() to the var "bot"

bot.on("ready", function() { // when the bot starts up, set its game to Use *help and tell the console "Booted up!"
    bot.user.setGame("Use *info"); // sets the game the bot is playing (change the game to whatever you want)
    console.log("Booted up!"); // messages the console Booted up! (change the Booted up to whatever you want)
});

bot.on("guildMemberAdd", function(member) { // when a player joins, welcomes him and sets his role to Member
    member.guild.channels.find("name", "welcome").send("Welcome " + member.toString() + " to Cookie Nation! Please read the rules in " + member.guild.channels.find("name", "rules")); // welcome the user (change the message to whatever you want)
    member.addRole(member.guild.roles.find("name", "Member")); // gives the user the member role (change the Member to any role on your server)
});

bot.on("message", function(message) { // when a message is sent, check if it was a user and he sent the prefix defined at the beginning
    if (message.author.equals(bot.user)) return; // if the message was sent by a bot, ignore the rest

    if (!message.content.startsWith(PREFIX)) return; // if the message doesn't contain PREFIX (*), then ignore

    var args = message.content.substring(PREFIX.length).split(" "); // creates a array called args, and removes the PREFIX (*) from that array
    var command = args[0].toLowerCase(); // sets the command to lowercase (making it incase sensitive)
    var mutedrole = message.guild.roles.find("name", "muted"); // defines the variable mutedrole to find the muted role (not neccessary)

    // now if we passed all those tests before, it will check if the message contained any of the following words, the commands

    if (command == "help") { // creates a command *help, to display a list of all the commands
        var embedhelpmember = new Discord.RichEmbed() // sets a embed box to the variable embedhelpmember
            .setTitle("**List of Commands**\n") // sets the title to List of Commands
            .addField(" - help", "Displays this message (Correct usage: *help)") // sets a field to explain the command *help
            .addField(" - info", "Tells info about myself :grin:") // sets a field to explain the command *info
            .addField(" - ping", "Tests your ping (Correct usage: *ping)") // sets a field to explain the command *ping
            .addField(" - cookie", "Sends a cookie to the desired player! :cookie: (Correct usage: *cookie @username)") // sets a field to explain the command *cookie
            .addField(" - 8ball", "Answers to all of your questions! (Correct usage: *8ball [question])") // sets a field to explain the command *8ball
            .addField(" - suggest", "Send a suggestion about the server, or bot, or anything really! (Correct usage: *suggest [suggestion])")
            .setColor(0xFFA500) // sets the color of the embed box to orange
            .setFooter("You need help, do you?"); // sets the footer to "You need help, do you?"
        var embedhelpadmin = new Discord.RichEmbed() // sets a embed box to the var embedhelpadmin
            .setTitle("**List of Admin Commands**\n") // sets the title to List of Admin Commands
            .addField(" - say", "Makes the bot say whatever you want (Correct usage: *say [message])") // sets a field to explain the command *say
            .addField(" - test", "Tests if the bot is working (Correct usage: *test)")
            .addField(" - purge", "Deletes up to 99 messages (Correct usage: *purge [amount])") // sets a field to explain the command *purge
            .addField(" - mute", "Mutes a desired member with a reason (Coorect usage: *mute @username [reason])") // sets a field to explain the command *mute
            .addField(" - unmute", "Unmutes a muted player (Correct usage: *unmute @username)") // sets a field to explain the command *unmute
            .addField(" - kick", "Kicks a desired member with a reason (Correct usage: *kick @username [reason])") // sets a field to explain the command *kick
            .addField(" - ban", "Bns a member from the guild :smirk: (Correct usage: *ban @username [reason])") // sets a field to explain the command *ban
            .addField(" - unban", "Unbans a banned user :smile: (Correct usage: *unban @username)") // sets a field to explain the command *unban
            .setColor(0xFF0000) // sets the color of the embed box to red
            .setFooter("Ooo, an admin!"); // sets the footer of the embed box to "Ooo, an admin!"
        message.channel.send(embedhelpmember); // sends the embed box "embedhelpmember" to the chat
        if(message.member.roles.some(r=>["bot-admin"].includes(r.name)) ) return message.channel.send(embedhelpadmin); // if member is a botadmin, display this too
    };

    if (command == "info") { // creates the command *info
        message.channel.send("Hey! My name is cookie-bot and I'm here to assist you! You can do *help to see all of my commands! If you have any problems with the Minecraft/Discord server, you can contact an administrator! :smile:"); // gives u info
    };

    if (command == "ping") { // creates a command *ping
        message.channel.send("Pong!"); // answers with "Pong!"
    };

    if (command == "cookie") { // creates the command *cookie
        if (args[1]) message.channel.send(message.author.toString() + " has given " + args[1].toString() + " a cookie! :cookie:"); // sends the message saying someone has given someone else a cookie if someone mentions someone else
        else message.channel.send("Who do you want to send a cookie to? :cookie: (Correct usage: *cookie @username)"); // sends the error message if no-one is mentioned
    };

    if (command == "8ball") { // creates the command *8ball
        if (args[1] != null) message.reply(eightball[Math.floor(Math.random() * eightball.length).toString(16)]); // if args[1], post random answer
        else message.channel.send("Ummmm, what is your question? :rolling_eyes: (Correct usage: *8ball [question])"); // if not, error
    };

    if (command == "suggest") {
        var suggestionMessage = message.content.substring(8);
        if (!suggestionMessage) return message.reply("What do you want to suggest? (Correct usage: *suggest [suggestion])");
        bot.fetchUser(229470021447843840)
            .then(user => user.send(message.author + " suggests: " + suggestionMessage))
            .catch(error => message.reply(`Sorry @${message.author}, suggestion coudln't be sent because of : ${error}`));
        message.reply("Suggestion succesfully sent!")
    };

    if (command == "test") {
        if (!message.member.roles.some(r=>["bot-admin"].includes(r.name)) ) return message.reply("Sorry, you do not have the permission to do this!");
        message.channel.send("Test succesful :thumbsup:");
    };

    if (command == "say") { // creates command *say
        if (!message.member.roles.some(r=>["bot-admin"].includes(r.name)) ) return message.reply("Sorry, you do not have the permission to do this!"); // if the meber isn't bot-admin, returns error
        var sayMessage = message.content.substring(4); // removes the prefix and the command from the var sayMessage
        if (!sayMessage) return message.reply("What do you want me to say? (Correct usage: *say [message])"); // if user doesn't enter a message, return this error
        message.delete().catch(O_o=>{}); // deletes the command entered by user
        message.channel.send(sayMessage); // send what the user said
    };

    if(command === "purge") { // creates the command *purge
        if (!message.member.roles.some(r=>["bot-admin"].includes(r.name)) ) return message.reply("Sorry, you do not have the permission to do this!"); // if the user does not have permissions to do this
        var messagesToDelete = args[1]; // sets the var messagesToDelete to the 1 argument, the number the user entered
        if (!args[1]) return message.reply("How many messages do you want to delete? (Correct usage: *purge [number])"); // if user didn't enter a number, print error
        if (args[1] > 99) return message.reply("Please delete less than 99 messages"); // if user enters over 99 messages, return error
        message.channel.fetchMessages({limit: messagesToDelete}) // gets the amount of messages to delete
        .then(messages => message.channel.bulkDelete(messages.size + 1)) // deletes the amount of messages to delete + 1 = the command message the user sent
        .catch(error => message.reply(`Sorry ${message.author} I couldn't prune because of : ${error}`)); // if an error occurs, post to the chat the error
    };

    if (command == "mute") { // creates the command *mute
        if (!message.member.roles.some(r=>["bot-admin"].includes(r.name)) ) return message.reply("Sorry, you do not have the permission to do this!"); // if user has no perms
        var mutedmember = message.mentions.members.first(); // sets the mentioned user to the var mutedmember
        if (!mutedmember) return message.reply("Please mention a valid member of this server! (Correct usage: *mute @username)"); // if there is no user mentions, return error
        if (mutedmember.hasPermission("ADMINISTRATOR")) return message.reply("I cannot mute this member! (Do I have perms? Is this member higher than me?)"); // if member is an admin, return error
        var mutereasondelete = 10 + mutedmember.user.id.length; //sets the length of the reason
        var mutereason = message.content.substring(mutereasondelete).split(" "); // deletes the first letters until it reaches the reason
        var mutereason = mutereason.join(" "); // joins the list mutereason into one line
        if (!mutereason) return message.reply("Please indicate a reason for the mute!"); // if no reason, return error
        mutedmember.addRole(mutedrole) //if reason is there, mute
            .catch(error => message.reply(`Sorry ${message.author} I couldn't mute because of : ${error}`)); //if error, display error
        message.reply(`${mutedmember.user} has been muted by ${message.author} because: ${mutereason}`); // sends a message saying he was muted
    };

    if (command == "unmute") { // creates the command unmute
        if (!message.member.roles.some(r=>["bot-admin"].includes(r.name)) ) return message.reply("Sorry, you do not have the permission to do this!"); // if author has no perms
        var unmutedmember = message.mentions.members.first(); // sets the mentioned user to the var kickedmember
        if (!unmutedmember) return message.reply("Please mention a valid member of this server!"); // if there is no kickedmmeber var
        unmutedmember.removeRole(mutedrole) //if reason, kick
            .catch(error => message.reply(`Sorry ${message.author} I couldn't mute because of : ${error}`)); //if error, display error
        message.reply(`${unmutedmember.user} has been unmuted by ${message.author}!`); // sends a message saying he was kicked
    };

    if (command == "kick") { // creates the command kick
        if (!message.member.roles.some(r=>["bot-admin"].includes(r.name)) ) return message.reply("Sorry, you do not have the permission to do this!"); // if author has no perms
        var kickedmember = message.mentions.members.first(); // sets the mentioned user to the var kickedmember
        if (!kickedmember) return message.reply("Please mention a valid member of this server!"); // if there is no kickedmmeber var
        if (!kickedmember.kickable) return message.reply("I cannot kick this member!"); // if the member is unkickable
        var kickreasondelete = 10 + kickedmember.user.id.length; //sets the length of the kickreasondelete
        var kickreason = message.content.substring(kickreasondelete).split(" "); // deletes the first letters until it reaches the reason
        var kickreason = kickreason.join(" "); // joins the list kickreason into one line
        if (!kickreason) return message.reply("Please indicate a reason for the kick!"); // if no reason
        kickedmember.kick(kickreason) //if reason, kick
            .catch(error => message.reply(`Sorry @${message.author} I couldn't kick because of : ${error}`)); //if error, display error
        message.reply(`${kickedmember.user} has been kicked by ${message.author} because: ${kickreason}`); // sends a message saying he was kicked
    };

    if (command == "ban") {
        if (!message.member.roles.some(r=>["bot-admin"].includes(r.name)) ) return message.reply("Sorry, you do not have the permission to do this!");
        var bannedmember = message.mentions.members.first();
        if (!bannedmember) return message.reply("Please mention a valid user of this server!");
        if (!bannedmember.bannable) return message.reply("I cannot ban this member!");
        var banreasondelete = 9 + bannedmember.user.id.length;
        var banreason = message.content.substring(banreasondelete).split(" ");
        var banreason = banreason.join(" ");
        if (!banreason) return message.reply("Please indicated a reason for the ban!");
        bannedmember.ban(banreason)
            .catch(error => message.reply(`Sorry ${message.author} I couldn't unbanned because of: ${error}`));
        message.reply(`${bannedmember.user} has been banned by ${message.author} because: ${banreason}`);
    };

    if (command == "unban") {
        if (!message.member.roles.some(r=>["bot-admin"].includes(r.name)) ) return message.reply("Sorry, you do not have the permission to do this!");
        var unbannedmember = args[1];
        message.guild.unban(unbannedmember)
            .catch(error => message.reply(`Sorry ${message.author} I couldn't unban because of: ${error}`));
        message.reply(`${unbannedmember.user} has been unbanned by ${message.author}`);
    };

});

bot.login(process.env.BOT_TOKEN); // connects to the bot

