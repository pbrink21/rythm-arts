const http = require('http');
const fs = require('fs');
const _ = require('lodash');



const server = http.createServer((req,res) => {
    console.log(req.url, req.method);
    
    res.setHeader('Content-type', 'text/html');

    let path = './public';
    switch(req.url) {
        case '/':
            path += '/landing page.html';
            break;
        case '/signup':
            path += '/signup page.html';
            break;
        case '/shop':
            path += '/shop page.html';
            break;
        case '/mainmenu':
            path += '/main menu.html';
            break;
        case '/highscore':
            path += '/high score page.html';
            break;
        case '/game':
            path += '/game page.html';
            break;
        case '/board':
            path += '/board.html'
    }

    fs.readFile(path, (err, data) => {
        if (err) {
            console.log('---ERROR---');
            console.log(err);
        }else{
            res.write(data);
            res.end();
        }
    })
});

server.listen(3000, 'localhost', () => {
    console.log('listening on port 3000');
})