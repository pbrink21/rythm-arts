const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/user'); //model init

const app = express(); //server init

//database init
//user: team1
//pass: team1COMS
const db_uri = 'mongodb+srv://team1:team1COMS@cluster0.o5usw.mongodb.net/RhythmArts?retryWrites=true&w=majority';
mongoose.connect(db_uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => console.log("Connected to the database!"), app.listen(3000))
    .catch((err) => console.log(err));

app.set('view engine', 'ejs');
app.set('views', 'public');

//setting path for serving files
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));

//get all users
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

//add a new user
app.post('/users', (req, res) => {
    const newuser = new User(req.body);

    User.findOne({
        user_name: req.body.user_name,
    }, (err, user) => {
        if (err) {
            console.log(err);
            return;
        } else if (user == null) { //if username not taken
            newuser.save()
                .then((result) => {
                    setCookie(newuser, res);
                    res.redirect('/mainmenu');
                })
                .catch((err) => {
                    console.log(err);
                })
        }
        else { //if username taken
            res.redirect('/signup');
        }
    });
});


//login with an existing user
app.post('/users/login', (req, res) => {
    const newuser = new User(req.body);
    console.log(req.body.user_pass);

    User.findOne({
        user_name: req.body.user_name
    }, (err, user) => {
        console.log("DB INFO");
        console.log(user);
        console.log("FORM INFO");
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
            console.log("USERNAME" + user.user_name);
            setCookie(user, res);
            res.redirect('/mainmenu');
        } else {
            return res.status(401).send({ message: "Wrong Password" });
        }
    });
});

app.post('/users/stats', (req, res) => {
    const requser = new User(req.body);
    console.log("POSTING STATS");
    console.log(requser);
    User.findOne({
        user_name: requser.user_name
    }, (err, user) => {
        if (err) {
            console.log(err);
            return;
        }
        User.updateOne({
            user_name: requser.user_name
        }, {
            points: user.points + requser.points,
            circleshit: user.circleshit + requser.circleshit,
            circlesmiss: user.circlesmiss + requser.circlesmiss,
            gameswon: user.gameswon + requser.gameswon,
            gameslost: user.gameslost + requser.gameslost
        }, (err, data) => {
            if (err) {
                console.log(err);
            }
            else {
                console.log(data);
            }
        }
        );
    });
    res.redirect('/mainmenu');
});



app.get('/', (req, res) => {
    console.log("enter root route");
    deleteCookie(res);
    res.render('landing page');

});

app.get('/signup', (req, res) => {
    res.render('signup page');
});

app.get('/shop', (req, res) => {
    res.render('shop page');
});

app.get('/mainmenu', (req, res) => {
    res.setHeader
    res.render('main menu');
});

app.get('/highscore', (req, res) => {
    User.find({}, function(err, users){
        console.log(users)
        res.render('high score page', {
        users:users
        })
    })
});

//OLD USER DATA RENDER
/*
app.get('/highscore', (req, res) => {
    User.findOne({user_name: 'was'}, function(err, users){
    User.findOne({ user_name: 'was' }, function (err, users) {
        console.log(users)
        res.render('high score page', {
            users
        })
    })
});
*/

app.get('/game', (req, res) => {
    res.render('game page');
});

app.get('/board', (req, res) => {
    res.render('board');
});


function setCookie(u, res) {
    var p = new Date();
    p.setTime(p.getTime() + (3 * 24 * 60 * 60 * 1000));
    var expires = "expires=" + p.toUTCString();
    res.cookie('user', u.user_name, { expires: p });
    res.cookie('points', u.points, { expires: p });
}

function deleteCookie(res) {
  var p = new Date();
  p.setTime(p.getTime() - (3 * 24 * 60 * 60 * 1000)); //sets cookie experation date to 5 days before today
  res.cookie('user', "l", {expires: p});
  //document.cookie = cname + "=expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}
