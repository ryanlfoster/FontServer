var express = require('express'),
    mongoose = require('mongoose'),
    port = 7200,
    root = __dirname;

var app = express();

//CORS Middleware
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:8000');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
};

app.configure(function() {
    app.use(allowCrossDomain);
});

mongoose.connect('mongodb://localhost/fonts');

var FontSchema = new mongoose.Schema({
    family: String,
    subsets: String,
    variants: String,
    main_class: String,
    sub_class: String,
    x_height: String,
    a_type: String
});

var Font = mongoose.model('Font', FontSchema);


app.post('/api/font', express.bodyParser(), function(req, res) {
    var newFont = new Font(req.body);
    newFont.save(function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log('Added font "' + req.body.family + '" to db');
        }
        res.send(newFont);
    });
});


app.listen(port, function() {
    console.log('Express listening on port ' + port);
});
