var express = require('express'),
    mongoose = require('mongoose'),
    _ = require('./lib/underscore-min'),
    port = 7200,
    root = __dirname;

var app = express();

//CORS Middleware
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:8000');
    res.header('Access-Control-Allow-Methods', 'OPTIONS,GET,POST,PUT,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
};

app.configure(function() {
    app.use(express.methodOverride());
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


//Return an OK for OPTIONS requests
app.options('*', function(req, res) {
    res.send(200);
});

//Return full list of fonts
app.get('/api/fonts', function(req, res) {
    Font.find(function(err, fonts) {
        if (!err) {
            res.send(fonts);
        } else {
            console.log(err);
        }
    });
});

//Update a font document
app.put('/api/fonts/:id', express.bodyParser(), function(req, res) {
    console.log('Updating ' + req.body.family);
    Font.findById(req.params.id, function(err, font) {
        _.extend(font, req.body);

        font.save(function(err) {
            if(!err) {
                console.log(font.family + ' update complete');
            } else {
                console.log(err);
            }

            res.send(font);
        });
    });
});


//Save a single, new font (likely unneeded)
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
