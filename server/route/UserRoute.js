
// NOTE that app is defined globally

var User = require('./../model/User.js');
var Roles = require('./..model/Roles.js');

User
    .methods(['get', 'post', 'put', 'delete'])
    .before('post', function (req, res, next) {
        // be sure these fields are saved
        req.body.registerDate = new Date();
        req.body.points = 0;
        req.body.place = -1;
        req.body.role = Roles.user.name;
        next();
    })
    .route('rm-rf.delete', {
        handler: function(req, res, next) {
            User.remove({}, function(err) {
                if (err) {
                    res.statusCode = 400;
                    res.json({
                        message: "An error has occured."
                    });
                }
                else{
                    res.json({
                        message: "Success."
                    });
                    console.log('User collection removed');
                }
            });
        }
    });

User.register(app, '/api/user');

