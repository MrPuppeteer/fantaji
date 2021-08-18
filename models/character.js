const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CharacterSchema = new Schema({
    name: String,
    race: String,
    class: String,
    alignment: String,
    equipments: [String]
})

module.exports = mongoose.model('Character', CharacterSchema);