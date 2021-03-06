var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var mongoDB = 'mongodb://kevin_niland:JustaHollow97@ds111422.mlab.com:11422/mongo_express_lab';

mongoose.connect(mongoDB);

var Schema = mongoose.Schema;

var postSchema = new Schema ({
    title: String,
    content: String,
    image: String,
    video: String
})

var userSchema = new Schema ({
    username: String,
    password: String,
    firstName: String,
    lastName: String,
    profileImage: String
})

var PostModel = mongoose.model('post', postSchema);
var UserModel = mongoose.model('users', userSchema);

//Here we are configuring express to use body-parser as middle-ware. 
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
    });

// Used to run app using just the command 'node server.js'
app.use("/", express.static(path.join(__dirname, "angular")));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, "angular", "index.html"));
    res.send('Connected to server');
})

// app.get('/', function (req, res) {
//     res.send('Connected to server');
// })

// Post functions
app.post('/api/posts', function(req, res) {
    PostModel.create ({
        title: req.body.title,
        content: req.body.content,
        image: req.body.image,
        video: req.body.video 
    })

    res.send("Item added");
})

app.post('/api/users', function (req, res) {
    UserModel.create ({
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        profileImage: req.body.profileImage
    })

    res.send("User added");
})

app.get('/api/posts', function(req, res) {
    PostModel.find(function(err, data) {
        if (err) {
            res.send(err);
        }

        res.json(data);
    });
})

app.get('/api/users', function (req, res) {
    UserModel.find(function (err, data) {
        if (err) {
            res.send(err);
        }

        res.json(data);
    });
})

app.get('/getposts', function (req, res) {
    PostModel.findOne({'title': req.params.title}, 
        function (err, data) {
            if (err) {
                return handleError(err);
            }

            res.json(data);
        });
})

// Delete functions
app.delete('/api/posts/:id', function(req, res) {
    PostModel.deleteOne({ _id: req.params.id}, 
        function (err, data) {
            if (err) {
                res.send(err);
            }

            res.send(data);
        });
})

app.delete('/api/users/:id', function (req, res) {
    UserModel.deleteOne ({ _id: req.params.id}, 
        function (err, data) {
            if (err) {
                res.send(err);
            }

            res.send(data);
        });
})

// Update functions
app.get('/api/posts/:id', function(req, res) {
    PostModel.findById(req.params.id,
        function (err, data) {
            if (err) {
                return handleError(err);
            }

            res.json(data);
        })
})

app.get('/api/users/:id', function(req, res) {
    UserModel.findById(req.params.id,
        function (err, data) {
            if (err) {
                return handleError(err);
            }
            
            res.json(data);
        })
})

app.put('/api/posts/:id', function(req, res) {
    PostModel.findByIdAndUpdate (req.params.id, req.body, 
        function (err, data) {
            if (err) {
                return next(err);
            }

        res.json(data);
    });
})

app.put('/api/users/:id', function(req, res) {
    UserModel.findByIdAndUpdate (req.params.id, req.body, 
        function (err, data) {
            if (err) {
                return next(err);
            }

        res.json(data);
    });
})

// Defines port that app will be hosted on
var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("G00342269-App listening at http://%s:%s", host, port)
})