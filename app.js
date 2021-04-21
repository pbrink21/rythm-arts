const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/user');

const app = express();

const db_uri = 'mongodb+srv://team1:team1COMS@cluster0.o5usw.mongodb.net/RhythmArts?retryWrites=true&w=majority';
mongoose.connect(db_uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => console.log("Connected to the database!"), app.listen(3000))
    .catch((err) => console.log(err));


app.set('view engine', 'ejs');
app.set('views', 'public');


app.use(express.static(__dirname + '/src'));
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));


app.get('/users', (req, res) => {
    User.find()
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log('---All-USERS---');
            console.log(err);
        });
});

app.post('/users', (req, res) => {
    const newuser = new User(req.body);

    User.findOne({
        user_name: req.body.user_name,
    }, (err, user) => {
        if (err) {
            console.log(err);
            return;
        } else if (user == null) {
            newuser.save()
                .then((result) => {
                    res.redirect('/mainmenu');
                })
                .catch((err) => {
                    console.log(err);
                })
        }

        else if (user.user_pass != newuser.user_pass) {
            newuser.save()
                .then((result) => {
                    res.redirect('/mainmenu');
                })
                .catch((err) => {
                    console.log(err);
                })
        } else {
            res.redirect('/signup');
        }
    });
});



app.post('/users/login', (req, res) => {
    const newuser = new User(req.body);
    console.log(req.body.user_pass);

    User.findOne({
        user_name: req.body.user_name
    }, (err, user) => {
        console.log(user);
        console.log(newuser);

        if (err) {
            res.status(500).send({ message: err });
            console.log(err);
            return;
        }
        else if (!user) {
            return res.status(404).send({ message: "User does not exist" });
        }
        else if (user.user_pass == newuser.user_pass) {
            res.redirect('/mainmenu');
        } else {
            return res.status(401).send({ message: "Wrong Password" });
        }
    });
});



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