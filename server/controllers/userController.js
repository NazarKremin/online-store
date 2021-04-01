const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ApiError = require('../error/ApiError');
const { User, Basket } = require('../models/models');

const generateJwt = (id, email, role) => jwt.sign(
    { id, email, role },
    process.env.SECRET_KEY,
    { expiresIn: '24h' }
);

module.exports = {
    registration: async (req, res, next) => {
        try {
            const { email, password, role } = req.body;

            if (!email || !password) {
                return next(ApiError.badRequest('Некорректный email или password'));
            }
            const candidate = await User.findOne({ where: { email } });

            if (candidate) {
                return next(ApiError.badRequest('Пользователь с таким email уже существует'));
            }
            const hashPassword = await bcrypt.hash(password, 5);

            const user = await User.create({ email, role, password: hashPassword });

            const basket = await Basket.create({ userId: user.id });

            const token = generateJwt(user.id, user.email, user.role);

            // todo sendmailer && hashPassword

            res.json({ token });
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    },

    login: async (req, res, next) => {
        try {
            const { email, password } = req.body;

            const user = await User.findOne({ where: { email } });

            if (!user) {
                return next(ApiError.internal('Пользователь не найден'));
            }

            const comparePassword = bcrypt.compareSync(password, user.password);

            if (!comparePassword) {
                return next(ApiError.internal('Указан неверный пароль'));
            }

            const token = generateJwt(user.id, user.email, user.role);

            res.json({ token });
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    },

    check: async (req, res, next) => {
        try {
            const token = generateJwt(req.user.id, req.user.email, req.user.role);

            res.json({ token });
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
};
