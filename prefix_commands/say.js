module.exports = {
    name: 'say',
    description: 'Repeats the message provided by the user and deletes the command message.',
    async execute(message, args) {
        if (args.length > 0) {
            try {
                await message.channel.send(args.join(' ')); // Join all arguments to form the message
                await message.delete(); // Delete the command message
            } catch (error) {
                console.error('Error sending message:', error);
            }
        } else {
            await message.reply('You need to provide a message to say!');
        }
    },
};
