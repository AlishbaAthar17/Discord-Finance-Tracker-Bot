const { Client, GatewayIntentBits } = require("discord.js")
const pool = require('./database')
require('dotenv').config();

const expenses = {}

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
}); //a virtual client thru which we can interact with the server, has access to guilds and messages (can create update delete handle)
let hasGreeted = false

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
});

client.on("messageCreate", (message) => {
    if (message.author.bot) return;

    if (message.content.startsWith("!log")) {
        const args = message.content.split(" ")
        const amount = parseFloat(args[1])
        const category = args.slice(2).join(" ")

        if (!amount || isNaN(amount) || !category) {
            return message.reply("Please provide a valid amount and category (e.g., !log 10.50 groceries).")
        }

        // storing in discords chat memory
        if (!expenses[message.author.id]) {
            expenses[message.author.id] = []
        }

        expenses[message.author.id].push({ amount, category });
        // return message.reply(`Logged expense of $${amount.toFixed(2)} for ${category}.`)

        // storing expense in database
        (async () => {
            try {
                const query = 'INSERT INTO expenses (user_id, amount, category) VALUES ($1, $2, $3)'
                await pool.query(query, [message.author.id, amount, category])
                return message.reply(`Logged expense of $${amount.toFixed(2)} for ${category}.`)
            } catch (err) {
                console.error(err)
                return message.reply("Failed to log expense.")
            }
        })()
        
    }

    if (message.content === "!total expenses") {
        const userExpenses = expenses[message.author.id] || []
        const total = userExpenses.reduce((sum, expense) => sum + expense.amount, 0)
        return message.reply(`Your total expenses are $${total.toFixed(2)}.`)
    }

    if (message.content === "!summary") {
        const userExpenses = expenses[message.author.id] || []
        if (userExpenses.length === 0) {
            return message.reply("You have no logged expenses.")
        }

        const summary = userExpenses.map(exp => `${exp.category}: $${exp.amount.toFixed(2)}`).join(", ")
        return message.reply(`Your expenses: ${summary}`)
    }
});


client.on('messageCreate', (message) => {
    // console.log(message.content) //To get the messages on the terminal
    if (message.author.bot) return
    if (message.content.startsWith('create')) {
        const URL = message.content.split('create')
        return message.reply({
            content: "Generating a short ID for " + URL,
        })

    }
    if (!hasGreeted) {
        message.reply({
            content: "Hi, Bot here! To log in your expense type '!log amount productName', to get the total, type '!total expenses', to get the summary, type '!summary'"
        })
        hasGreeted = true
    }

})

client.on('interactionCreate', (interaction) => {
    console.log(interaction)
    interaction.reply("Pong!")
})

client.login(process.env.DISCORD_TOKEN)