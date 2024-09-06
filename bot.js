const { Client, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { token, clientId, guildId } = require('./config.json');

// Initialize the client
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

// Set up command collections
client.commands = new Collection();
client.prefixCommands = new Collection();

// Load commands from both directories
const commandDirs = ['commands', 'prefix_commands']; // Add your new directory here

commandDirs.forEach(dir => {
    const commandPath = path.join(__dirname, dir);
    const commandFiles = fs.readdirSync(commandPath).filter(file => file.endsWith('.js'));

    commandFiles.forEach(file => {
        const filePath = path.join(commandPath, file);
        const command = require(filePath);
        if (command.data) {
            client.commands.set(command.data.name, command);
        } else {
            client.prefixCommands.set(command.name, command);
        }
    });
});

// Register slash commands
const commands = client.commands.map(cmd => cmd.data.toJSON());

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error('Error registering commands:', error);
    }
})();

// Handle prefix commands
client.on('messageCreate', async message => {
    if (message.author.bot) return;

    const prefix = '?'; // Define your prefix here
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.prefixCommands.get(commandName);

    if (!command) return;

    try {
        await command.execute(message, args);
    } catch (error) {
        console.error('Error executing command:', error);
        message.reply('There was an error executing that command!');
    }
});

// Handle slash commands
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction, client);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.login(token);
