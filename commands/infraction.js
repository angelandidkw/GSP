const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('infraction')
        .setDescription('Logs an infraction action')
        .addUserOption(option =>
            option.setName('username')
                .setDescription('The user receiving the infraction')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason for the infraction')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('outcome')
                .setDescription('The outcome of the infraction')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('rank')
                .setDescription('The rank of the individual')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('notes')
                .setDescription('Additional notes')),

    async execute(interaction) {
        // Define the allowed role IDs and the user ID that should have access
        const allowedRoleIds = ['1262179118947106816', '1262179510053371974'];
        const allowedUserId = '503575577567952906';

        // Check if the user has one of the required roles or is the allowed user
        const hasAccess = interaction.member.roles.cache.some(role => allowedRoleIds.includes(role.id)) || interaction.user.id === allowedUserId;

        if (!hasAccess) {
            return interaction.reply({
                content: 'You do not have permission to use this command.',
                ephemeral: true
            });
        }

        const user = interaction.options.getUser('username');
        const reason = interaction.options.getString('reason');
        const outcome = interaction.options.getString('outcome');
        const rank = interaction.options.getString('rank') || 'No change';
        const notes = interaction.options.getString('notes') || 'N/A';

        const response = `  <:GSP:1271866419604094997> | **GSP Infraction**
    <:whiteline:1261487592193527910><:whiteline:1261487592193527910><:whiteline:1261487592193527910><:whiteline:1261487592193527910><:whiteline:1261487592193527910><:whiteline:1261487592193527910><:whiteline:1261487592193527910><:whiteline:1261487592193527910><:whiteline:1261487592193527910>
> **Username:** <@${user.id}>
> **Rank:** ${rank}
> **Reason:** ${reason}
> **Outcome:** ${outcome}
> **Note(s):** ${notes}`;

        await interaction.reply(response);
    },
};