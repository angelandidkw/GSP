const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const pulledOverLogChannelId = '1264193424681074770'; // Replace with your pulled over log channel ID
const arrestLogChannelId = '1264193291629629576'; // Replace with your arrest log channel ID
const requiredRoleId = '1240529580930895892'; // The role ID that can execute this command

module.exports = {
    data: new SlashCommandBuilder()
        .setName('log')
        .setDescription('Logs an arrest or a pulled over event')
        .addSubcommand(subcommand =>
            subcommand
                .setName('arrest')
                .setDescription('Log an arrest')
                .addStringOption(option => 
                    option.setName('reason')
                        .setDescription('Reason for stop')
                        .setRequired(true))
                .addStringOption(option => 
                    option.setName('charges')
                        .setDescription('Charges')
                        .setRequired(true))
                .addAttachmentOption(option => 
                    option.setName('attachment')
                        .setDescription('Optional attachment')
                        .setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('pull-over')
                .setDescription('Logs a pulled over event')
                .addStringOption(option => 
                    option.setName('vehicle')
                        .setDescription('Description of the vehicle')
                        .setRequired(true))
                .addStringOption(option => 
                    option.setName('reason')
                        .setDescription('Reason for being pulled over')
                        .setRequired(true))
        ),
    async execute(interaction) {
        // Check if the user has the required role
        if (!interaction.member.roles.cache.has(requiredRoleId)) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'arrest') {
            const reason = interaction.options.getString('reason');
            const charges = interaction.options.getString('charges');
            const attachment = interaction.options.getAttachment('attachment');
            const user = interaction.user;

            const embed = new EmbedBuilder()
                .setColor('2d2d31') // Color code #2d2d31
                .setTitle('Arrest Log')
                .addFields(
                    { name: 'Arrested by', value: `<@${user.id}>` },
                    { name: 'Reason for Stop', value: reason },
                    { name: 'Charges', value: charges }
                );

            if (attachment) {
                embed.setImage(attachment.url);
            }

            const channel = interaction.client.channels.cache.get(arrestLogChannelId); // replace with actual ID
            if (channel) {
                channel.send({ embeds: [embed] });
            } else {
                console.error('Arrest log channel not found');
            }

            await interaction.reply('Arrest logged successfully.');
        } else if (subcommand === 'pull-over') {
            const vehicleDescription = interaction.options.getString('vehicle');
            const reasonForStop = interaction.options.getString('reason');
            const user = interaction.user;

            const embed = new EmbedBuilder()
                .setColor('2d2d31') // Color code #2d2d31
                .setTitle('Traffic Stop Information')
                .addFields(
                    { name: 'Vehicle Description', value: vehicleDescription },
                    { name: 'Reason for Stop', value: reasonForStop },
                    { name: 'Signed by', value: `<@${user.id}>` }
                );

            const channel = interaction.client.channels.cache.get(pulledOverLogChannelId);
            if (channel) {
                channel.send({ embeds: [embed] });
            } else {
                console.error('Pulled over log channel not found');
            }

            await interaction.reply('Traffic stop information logged successfully.');
        }
    },
};
