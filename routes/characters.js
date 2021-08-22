const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { characterSchema } = require('../schemas');
const ExpressError = require('../utils/ExpressError');
const Character = require('../models/character');

const validateCharacter = (req, res, next) => {
    const { error } = characterSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(400, msg)
    }
    next();
}

router.get('/', catchAsync(async (req, res) => {
    const characters = await Character.find({});
    res.render('characters/index', { characters });
}));

router.get('/new', (req, res) => {
    res.render('characters/new');
});

router.post('/', validateCharacter, catchAsync(async (req, res) => {
    const character = new Character(req.body.character);
    await character.save();
    res.redirect(`/characters/${character._id}`);
}));

router.get('/:id', catchAsync(async (req, res) => {
    const character = await Character.findById(req.params.id);
    res.render('characters/show', { character });
}));

router.get('/:id/edit', catchAsync(async (req, res) => {
    const character = await Character.findById(req.params.id);
    res.render('characters/edit', { character });
}));

router.put('/:id', validateCharacter, catchAsync(async (req, res) => {
    const { id } = req.params;
    const character = await Character.findByIdAndUpdate(id, { ...req.body.character });
    res.redirect(`/characters/${character._id}`);
}));

router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Character.findByIdAndDelete(id);
    res.redirect('/characters');
}));

module.exports = router;