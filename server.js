var express = require('express');
var app = express();

app.set('view engine','ejs');
app.use(express.static(__dirname+ '/public'));

app.get('/new', function(req,res){
  var theID = Math.random().toString(36).substr(2, 9);
  res.redirect('/?id=' + theID);

});

app.get('/', function(req,res){
  res.render('home');
});

var port = process.env.PORT || 8000;

app.listen(port);
