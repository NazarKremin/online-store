const { Type } = require('../models/models');
const ApiError = require('../error/ApiError');

module.exports = {
    create: async (req, res, next) => {
        try {

        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
        const { name } = req.body;

        const type = await Type.create({ name });
        res.json(type);
    },

    getAll: async (req, res, next) => {
        try {
            const types = await Type.findAll();

            res.json(types);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

};
