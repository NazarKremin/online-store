const bcrypt = require('bcrypt');
const { errorMessages } = require('../messages');

module.exports = {
    hash: (password) => bcrypt.hash(password, 10),
    compare: (password, hashPassword) => {
        const isPasswordEqual = bcrypt.compare(password, hashPassword);

        if (!isPasswordEqual) {
            throw new Error(errorMessages.NOT_VALID_EMAIL_OR_PASSWORD.ua);
        }
    }
};