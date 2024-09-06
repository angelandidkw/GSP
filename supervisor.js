const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('supervisor')
        .setDescription('Request a supervisor')
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for requesting a supervisor')
                .setRequired(true)),
    async execute(interaction) {
        // Role and channel IDs (replace these with actual values)
        const requiredRoleId = '1265918378007072820';
        const supervisorRoleId = '1265918378007072820';
        const supervisorRequestChannelId = '1262850120165359626';

        // Check if the user has the required role
        if (!interaction.member.roles.cache.has(requiredRoleId)) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        const reason = interaction.options.getString('reason');
        const user = interaction.user;

        const embed = new EmbedBuilder()
            .setColor(0x2d2d31) // Color code #2d2d31
            .setTitle('Supervisor Request')
            .addFields(
                { name: 'Attention!', value: `A supervisor has been requested.` },
                { name: 'Requested by', value: `<@${user.id}>` },
                { name: 'Reason', value: reason }
            );

        const channel = interaction.client.channels.cache.get(supervisorRequestChannelId);
        if (channel) {
            await channel.send({
                content: `<@&${supervisorRoleId}>`,
                embeds: [embed]
            });
        } else {
            console.error('Supervisor request channel not found');
        }

        await interaction.reply('Your supervisor request has been logged.');
    },
};
