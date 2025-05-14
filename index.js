require('dotenv').config();
const {Bot, GrammyError, HttpError, Keyboard, InlineKeyboard} = require('grammy');
const { hydrate } = require('@grammyjs/hydrate');

const bot = new Bot(process.env.BOT_API_KEY);
bot.use(hydrate());

// Initialization

bot.command('start', async (ctx) => {
    await ctx.reply('Привет, я живое');
})

bot.api.setMyCommands([
    {
        command: 'start',
        description: 'Запуск бота'
    },
    {
        command: 'say_hello',
        description: 'Поздороваться'
    },
    {
        command: 'reply',
        description: 'Ответить'
    },
    {
        command: 'reaction',
        description: 'Поставить клубничку'
    },
    {
        command: 'mood',
        description: 'Что по настроению?'
    }
])

// Contact with user

bot.command(['say_hello', 'say_hi'], async (ctx) => {
    await ctx.reply('И тебе приветики');
})

bot.on([':voice', ':video'], async (ctx) => {
    await ctx.reply('Это мне не интересно');
})

// message:entities:url works too
bot.on('::url', async (ctx) => {
    await ctx.reply('Подозрительная ссылка... Вы точно не мошенники?');
})

bot.on(':photo').on('::hashtag', async (ctx) => {
    await ctx.reply('Я тебе не инстаграм');
})

bot.on(':photo', async (ctx) => {
    await ctx.reply('Скинь лучше мем с котиком');
})

bot.on('msg').filter((ctx) => {
    return ctx.from.id === 111111111
}, async (ctx) => {
    await ctx.reply('Попался!');
})

bot.hears('ID', async (ctx) => {
    await ctx.reply(`Твой ID: ${ctx.from.id}`);
})

bot.command('reply', async (ctx) => {
    await ctx.reply('Вот твой ответик *hoho*', {
        reply_parameters: {message_id: ctx.msg.message_id},
        parse_mode: 'MarkdownV2' 
    });
})

bot.command('reaction', async (ctx) => {
    await ctx.react('🍓');
})

bot.command('mood', async (ctx) => {
    // const moodKeyboard = new Keyboard().text('Хорошо').row().text('Норм').text('Плохо').resized().oneTime()
    const moodLabels = ['Хорошо', 'Норм', 'Плохо']
    const rows = moodLabels.map(label => {
        return [
            Keyboard.text(label)
        ]
    });;
    const moodKeyboard = Keyboard.from(rows).resized().oneTime();
    await ctx.reply('Как настроение?', {
        reply_markup: moodKeyboard
    });
})

bot.hears('Хорошо', async (ctx) => {
    await ctx.reply(`Класс`);
})

bot.command('share', async (ctx) => {
    const shareKeyboard = new Keyboard().requestLocation('Локация').requestContact('Контакт').requestPoll('Опрос').resized()
    await ctx.reply('Поделиться данными', {
        reply_markup: shareKeyboard
    });
})

bot.command('come_url', async (ctx) => {
    const linkKeyboard = new InlineKeyboard().url('Открыть гугл', 'https://www.google.com/')
    await ctx.reply('Тык', {
        reply_markup: linkKeyboard
    });
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