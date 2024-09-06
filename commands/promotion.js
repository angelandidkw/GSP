const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('promotion')
        .setDescription('Logs a promotion action')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user receiving the promotion')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('rank')
                .setDescription('The new rank')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason for the promotion')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('notes')
                .setDescription('Additional notes')),

    async execute(interaction) {
        // Role ID that is allowed to use the command
        const allowedRoleId = '1262179118947106816';

        // Check if the user has the required role
        if (!interaction.member.roles.cache.has(allowedRoleId)) {
            return await interaction.reply({
                content: 'You do not have permission to use this command.',
                ephemeral: true
            });
        }

        const user = interaction.options.getUser('user');
        const rank = interaction.options.getString('rank');
        const reason = interaction.options.getString('reason');
        const notes = interaction.options.getString('notes') || 'N/A';

        const response = `<:GSP:1271866419604094997> | **GSP Promotion**\n\n` +
        '<:whiteline:1261487592193527910><:whiteline:1261487592193527910><:whiteline:1261487592193527910><:whiteline:1261487592193527910><:whiteline:1261487592193527910><:whiteline:1261487592193527910><:whiteline:1261487592193527910><:whiteline:1261487592193527910><:whiteline:1261487592193527910>\n' +
            `**Username:** <@${user.id}>\n` +
            `**Rank:** ${rank}\n` +
            `**Reason:** ${reason}\n` +
            `**Notes:** ${notes}`;

        await interaction.reply({ content: response });
    },
};
