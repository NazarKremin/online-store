const { emailActions } = require('../constans');

module.exports = {
    [emailActions.WELCOME]: {
        templateName: 'welcome',
        subject: 'Вітаю в команді'
    },
    [emailActions.USER_BLOCKED]: {
        templateName: 'user-blocked',
        subject: 'Твій аккаунт заблокований'
    },
    [emailActions.PASSWORD_CHANGE]: {
        templateName: 'password-change', // імя теплейту яке треба відмалювати
        subject: 'Пароль зміненний' // тема листа
    }
};
