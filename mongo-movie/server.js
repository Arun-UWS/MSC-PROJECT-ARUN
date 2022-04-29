const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');
const dbConfig = require('./config.js');
const mongoose = require('mongoose');
var path = require('path');
var routes = require('./routes');


const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

app.set('port', process.env.PORT || 7500);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));


//mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to MongoDB");
}).catch(err => {
    console.log('Could not connect to MongoDB', err);
    process.exit();
});

app.get('/', routes.index);
require('./routes/movie')(app);
app.listen(7500, () => {
    console.log("Server is listening on port ", 7500);
});