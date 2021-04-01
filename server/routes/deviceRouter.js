const router = require('express').Router();

const deviceController = require('../controllers/deviceController');

router.post('/', deviceController.create);

router.get('/', deviceController.getAll);

router.get('/:id', deviceController.getOne);

router.delete('/:id', deviceController.delete);

module.exports = router;
