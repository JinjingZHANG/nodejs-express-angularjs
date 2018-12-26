const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/user_info', { useNewUrlParser: true });

const Users = mongoose.model('Users');

module.exports = function (req, res, next) {
    var auth = req.headers['authorization'];
    if (auth == null) {
        var err = new Error('Not authorized! Go back!');
        err.status = 401;
        return next(err);
    }
    var tmp = auth.split(' ');
    var buf = new Buffer(tmp[1], 'base64');
    plainAuth = buf.toString();
    console.log(plainAuth);
    var creds = plainAuth.split(':');      // split on a ':'
    var username = creds[0];
    var password = creds[1];

    Users.findOne({ name: username }, function (err, data) {
        console.log(data);
        if (err) {
            return next(err);
        }
        if (data != null && data.password == password) {
            return next();
        } else {
            var err = new Error('Not authorized! Go back!');
            err.status = 401;
            return next(err);
        }
    });
};