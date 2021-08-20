const Joi = require('joi');

module.exports.characterSchema = Joi.object({
    character: Joi.object({
        name: Joi.string().required(),
        race: Joi.string().required(),
        class: Joi.string().required(),
        alignment: Joi.string().required(),
        equipments: Joi.array().items(Joi.string().allow(null, ''))
    }).required()
});
