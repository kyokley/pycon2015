var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var utils = require('./utils.js');

var routes = require('./routes/index');
var users = require('./routes/user');

var app = express();

app.use('/master', utils.basicAuth('admin', 'password'));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/reveal.js', express.static(path.join(__dirname, 'node_modules/reveal.js')));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/views/index.html');
});

app.get('/master', function(req, res){
  res.sendFile(__dirname + '/views/master.html');
});

// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('port', process.env.PORT || 3001);

var env = process.env.NODE_ENV || 'development';
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env == 'development';

// app.use(favicon(__dirname + '/public/img/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
//app.use('/reveal.js', express.static(path.join(__dirname, 'public/components/reveal.js')));

//app.use('/', routes);
//app.use('/users', users);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace

if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            title: 'error'
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        title: 'error'
    });
});
 


var server = http.createServer(app).listen(3001, function(){
  console.log("Express server listening on port 3001");
});
var io = require("socket.io");
var ioServer = io.listen(server);
ioServer.sockets.on('connection', function (socket) {
    socket.emit("message", "Welcome to Revealer");
    socket.on("slidechanged", function(data){
      socket.broadcast.emit("slidechanged", data);
    });
});
module.exports = app;
