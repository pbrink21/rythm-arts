const express = require('express');
//const host = 'coms-319-004.cs.iastate.edu';
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'public');


app.listen(3000);
console.log(__dirname);

app.use(express.static(__dirname + '/src'));
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    console.log("enter root route");
    res.render('landing page');

});

app.get('/signup', (req, res) => {
    res.render('signup page');
});

app.get('/shop', (req, res) => {
    res.render('shop page');
});

app.get('/mainmenu', (req, res) => {
    res.render('main menu');
});

app.get('/highscore', (req, res) => {
    res.render('high score page');
});

app.get('/game', (req, res) => {
    res.render('game page');
});

app.get('/board', (req, res) => {
    res.render('board');
});