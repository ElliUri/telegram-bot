const TelegramBot = require('node-telegram-bot-api');
const token = "7081425896:AAHqMCP4ZcKRq9Oof_zvT2FdSKgVqMlB4Ro";
// add token from bot father
const bot = new TelegramBot(token, { polling: true });

const quizQuestions = [
    {
      question: "Какой будет результат выполнения `console.log(typeof null)` в JavaScript?",
      options: [
        { text: 'Object', isCorrect: true },
        { text: 'Null', isCorrect: false },
        { text: 'Undefined', isCorrect: false }
      ]
    },
    {
      question: "Какой язык используется для стилизации веб-страниц?",
      options: [
        { text: 'HTML', isCorrect: false },
        { text: 'CSS', isCorrect: true },
        { text: 'JavaScript', isCorrect: false }
      ]
    },
    {
      question: "Какая компания разработала язык программирования JavaScript?",
      options: [
        { text: 'Microsoft', isCorrect: false },
        { text: 'Netscape', isCorrect: true },
        { text: 'Google', isCorrect: false }
      ]
    }
  ];

const userStates = {};

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    userStates[chatId] = { questionIndex: 0, correctAnswers: 0, incorrectAnswers: 0 };
    sendQuestion(chatId);
  });

  function sendQuestion(chatId) {
    const userState = userStates[chatId];
    const questionIndex = userState.questionIndex;
    const questionData = quizQuestions[questionIndex];
    
    const options = {
      reply_markup: {
        inline_keyboard: questionData.options.map((option, index) => [
          { text: option.text, callback_data: JSON.stringify({ questionIndex, optionIndex: index }) }
        ])
      }
    };
  
    bot.sendMessage(chatId, questionData.question, options);
  }
  
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;
    const { questionIndex, optionIndex} = JSON.parse(query.data);
    const questionData = quizQuestions[questionIndex];
    const selectedOption = questionData.options[optionIndex];
    const userState = userStates[chatId];

    if(selectedOption.isCorrect) {
        // ничего не работало до этого я написала , а надо было .
        bot.sendMessage(chatId, 'Правильно!')
        userState.correctAnswers++ 
    } else {
        bot.sendMessage(chatId, 'Неправильно!')
        userState.incorrectAnswers++
    }

    
    userState.questionIndex++;

    if (userState.questionIndex < quizQuestions.length) {
        sendQuestion(chatId)
    } else {
        bot.sendMessage(chatId, `Викторина завершена! Правильных ответов: ${userState.correctAnswers}, 
        Неправильных ответов: ${userState.incorrectAnswers}`)
        delete userStates[chatId];
    }
})