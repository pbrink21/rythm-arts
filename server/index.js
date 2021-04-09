const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const port = 3000



// We are using our packages here
app.use(bodyParser.json());       // to support JSON-encoded bodies

app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));
app.use(cors())

//You can use this to check if your server is working
app.get('/', (req, res) => {
    res.send("Welcome to your server")
})


//Route that handles login logic
app.post('/login', (req, res) => {
    console.log(req.body.username)
    console.log(req.body.password)

})

//Route that handles signup logic
app.post('/signup', (req, res) => {
    console.log(req.body.username)
    console.log(req.body.password)
    var mysql = require('mysql');

    var con = mysql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: 'password',
        database: 'rhythmarts'
    });
    con.connect(function (err) {
        if (err) throw err;
        console.log("Connected to server!");

        var values = [req.body.username, req.body.password];
        var sqlInsert = "INSERT INTO rhythmarts.users (user_name, user_pass) VALUES ?";

        con.query(sqlInsert, [values], function (err, result) {
            if (err) {
                console.log(err);
            } else {
                console.log("User Added");
            }

        });

        con.end(function (err) {
            if (err) {
                return console.log(err.message);
            } else {
                console.log("Close connection!");
            }
        });
    });
})

//Start your server on a specified port
app.listen(port, () => {
    console.log(`Server is runing on port ${port}`)
})



