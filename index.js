require('dotenv').config();
const {Bot, GrammyError, HttpError} = require('grammy');

const bot = new Bot(process.env.BOT_API_KEY);

// Initialization

bot.command('start', async (ctx) => {
    await ctx.reply('Привет, я живое')
})

bot.api.setMyCommands([
    {
        command: 'start',
        description: 'Запуск бота'
    },
    {
        command: 'say_hello',
        description: 'Поздороваться'
    }
])

// Contact with user

bot.command(['say_hello', 'say_hi'], async (ctx) => {
    await ctx.reply('И тебе приветики')
})

bot.on([':voice', ':video'], async (ctx) => {
    await ctx.reply('Это мне не интересно')
})

// message:entities:url works too
bot.on('::url', async (ctx) => {
    await ctx.reply('Подозрительная ссылка... Вы точно не мошенники?')
})

bot.on(':photo').on('::hashtag', async (ctx) => {
    await ctx.reply('Я тебе не инстаграм')
})

bot.on(':photo', async (ctx) => {
    await ctx.reply('Скинь лучше мем с котиком')
})

bot.on('msg').filter((ctx) => {
    return ctx.from.id === 111111111
}, async (ctx) => {
    await ctx.reply('Попался!')
})

// Error catching

bot.catch((err) => {
    const ctx = err.ctx;
    console.error('Error:', ctx.update.update_id);
    const e = err.error;

    if (e instanceof GrammyError) {
        console.error('Error:', e.description);
    } else if (e instanceof HttpError) {
        console.error('Could not contact Telegram:', e);
    } else {
        console.error('Unknown error:', e);
    }
})

// Start working

bot.start();