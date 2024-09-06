const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('myid')
        .setDescription('Replies with your Discord ID'),

    async execute(interaction) {
        const userId = interaction.user.id;

        // Send a reply with the user's ID that only the user can see
        await interaction.reply({ content: `Your Discord ID is \`${userId}\``, ephemeral: true });
    },
};

