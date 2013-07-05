/**
 * Module dependencies.
 */

var express = require('express')
    , http = require('http')
    , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 80);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.limit('150mb'));
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.bodyParser({ keepExtensions: true, /* maxFieldsSize: 10,*/ uploadDir: path.join(__dirname, 'temp') }));
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));


// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

http.createServer(app).listen(app.get('port'), function () {

    exports.app = app;

    require('./routes');

    require('./node_modules/db');

    console.log('Express server listening on port ' + app.get('port'));

});


/*
 app.get('/test', function (req, res) {
 */
/*
 * success:1 ,type:1 (2,3) value:1(50,100)
 失败：success:-1,type:1,(2,3) errCode:1 (2,3,4,5,6,7)*//*

 var data = {
 type: req.query.type,
 success: Math.random() >= .5 ? 1 : -1
 };

 var a = 0;
 var b = 2;
 var value = parseInt(Math.random() * 100, 10) % (b - a + 1) + a;


 var c = 0;
 var d = 6;
 var errCode = parseInt(Math.random() * 100, 10) % (d - c + 1) + c;

 if (data.success === 1) {
 data.value = [1, 50, 100][value];
 } else {
 data.errCode = [1, 2, 3, 4, 5, 6, 7][errCode];
 }

 res.jsonp(data);

 })
 */
