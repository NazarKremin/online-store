const uuid = require('uuid');
const path = require('path');
const { Device, DeviceInfo } = require('../models/models');
const ApiError = require('../error/ApiError');

module.exports = {
    create: async (req, res, next) => {
        try {
            let {
                name, price, brandId, typeId, info
            } = req.body;

            const { img } = req.files;

            const fileName = `${uuid.v4()}.jpg`;

            img.mv(path.resolve(__dirname, '..', 'static', fileName));

            const device = await Device.create({
                name, price, brandId, typeId, img: fileName
            });

            if (info) {
                info = JSON.parse(info);

                info.forEach((i) => DeviceInfo.create({
                    title: i.title,
                    description: i.description,
                    deviceId: device.id
                }));
            }

            res.json(device);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    },

    getAll: async (req, res, next) => {
        try {
            let {
                brandId, typeId, limit, page
            } = req.query;

            page = page || 1;

            limit = limit || 9;

            const offset = page * limit - limit;

            let devices;

            if (!brandId && !typeId) {
                devices = await Device.findAndCountAll({ limit, offset });
            }

            if (brandId && !typeId) {
                devices = await Device.findAndCountAll({ where: { brandId }, limit, offset });
            }

            if (!brandId && typeId) {
                devices = await Device.findAndCountAll({ where: { typeId }, limit, offset });
            }

            if (brandId && typeId) {
                devices = await Device.findAndCountAll({ where: { typeId, brandId }, limit, offset });
            }

            res.json(devices);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    },

    getOne: async (req, res, next) => {
        try {
            const { id } = req.params;

            const device = await Device.findOne(
                {
                    where: { id },
                    include: [{ model: DeviceInfo, as: 'info' }]
                },
            );

            res.json(device);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    },

    delete: async (req, res, next) => {
        try {

        } catch (e) {
            next(ApiError.badRequest(e.message));
        }

        const { id } = req.params;

        await Device.destroy({ where: { id } });

        res.json('Deleted');
    }
};
