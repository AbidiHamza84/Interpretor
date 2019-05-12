let express = require('express');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

let port = 6000;

let interpreterRouter = require('./routes/interpreter');

let app = express();

app.use(logger('prod'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/interpreter', interpreterRouter);

app.listen(port, function (err) {
    if (err) {
        return console.log(err)
    }
    return console.log(`server is listening on ${port}`)
});

module.exports = app;
