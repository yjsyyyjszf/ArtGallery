var mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    biography: {
        type: String
    },
    associate_culture_checkbox: {
        type: String
    },
    associate: {
        type: String
    },
    agencies: {
        type: String
    },
    tags: {
        type: String
    }
});


//authenticate input against database
UserSchema.statics.authenticate = function (email, password, callback) {
    User.findOne({ email: email })
      .exec(function (err, user) {
        if (err) {
          return callback(err)
        } else if (!user) {
          var err = new Error('User not found.');
          err.status = 401;
          return callback(err);
        }
        bcrypt.compare(password, user.password, function (err, result) {
          if (result === true) {
            return callback(null, user);
          } else {
            return callback();
          }
        })
      });
  }


var User = UserSchema;
module.exports.User = User;