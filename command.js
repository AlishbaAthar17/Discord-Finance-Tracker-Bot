const { REST, Routes } = require("discord.js")
require('dotenv').config();

//can create customized commands

const commands = [
    {
    name: 'ping',
    description: 'Replies with Pong!',
    },
    {
        name:"create",
        description:"Creates a new short URL"
    }
]

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN); //REST client

//the code below will help me register the commands
(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(Routes.applicationCommands(process.env.DISCORD_APP_ID), { body: commands });

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})()
