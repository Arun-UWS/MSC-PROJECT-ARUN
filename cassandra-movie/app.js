/**
 * Module dependencies.
 */

 var express = require('express');
 var routes = require('./routes');
 var http = require('http');
 var path = require('path');
 
 //load movies route
 var movies = require('./controllers/movies');
 //load cassandra route
 var cassandrainfo = require('./models/cassandrainfo');
 
 var app = express();
 
 var cassandra = require('cassandra-driver');
 
 const client = new cassandra.Client({contactPoints: [process.env.CASSANDRA_IP || 'cassandra']});
 
 // all environments
 app.set('port', process.env.PORT || 3000);
 app.set('views', path.join(__dirname, 'views'));
 app.set('view engine', 'ejs');
 app.use(express.logger('dev'));
 app.use(express.json());
 app.use(express.urlencoded());
 app.use(express.methodOverride());
 
 app.use(express.static(path.join(__dirname, 'public')));
 
 app.get('/', routes.index);
 require('./routes/movie')(app);
 app.get('/cassandrainfo', cassandrainfo.init_cassandra);
 
 
 app.use(app.router);
 
 http.createServer(app).listen(app.get('port'), function(){
   console.log('Express server listening on port ' + app.get('port'));
 });

 