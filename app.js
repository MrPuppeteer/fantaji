const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const Character = require('./models/character');

mongoose.connect('mongodb://localhost:27017/fantaji', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, "Connection error:"));
db.once('open', () => {
    console.log("Database connected");
});

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.engine('ejs', ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/characters', async (req, res) => {
    const characters = await Character.find({});
    res.render('characters/index', { characters });
});

app.get('/characters/new', (req, res) => {
    res.render('characters/new');
});

app.post('/characters', async (req, res) => {
    const character = new Character(req.body.character);
    await character.save();
    res.redirect(`/characters/${character._id}`);
});

app.get('/characters/:id', async (req, res) => {
    const character = await Character.findById(req.params.id);
    res.render('characters/show', { character });
});

app.get('/characters/:id/edit', async (req, res) => {
    const character = await Character.findById(req.params.id);
    res.render('characters/edit', { character });
});

app.put('/characters/:id', async (req, res) => {
    const { id } = req.params;
    const character = await Character.findByIdAndUpdate(id, { ...req.body.character });
    res.redirect(`/characters/${character._id}`);
});

app.delete('/characters/:id', async (req, res) => {
    const { id } = req.params;
    await Character.findByIdAndDelete(id);
    res.redirect('/characters');
})

app.listen(8080, () => {
    console.log('Serving on port 8080');
});