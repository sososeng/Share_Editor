var express = require('express');
var app = express();

app.set('view engine','ejs');
app.use('/static', express.static('public'));
app.get('/new', function(req,res){
  var theID = Math.random().toString(36).substr(2, 9);
  res.redirect('/id/?id=' + theID);

});

app.get('/id', function(req,res){
  res.render('pad');

});

app.get('/', function(req,res){
  res.render('home');
});

var port = process.env.PORT || 8001;

app.listen(port);
