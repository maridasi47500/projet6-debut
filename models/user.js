var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var User = new Schema({
    firstname: {type: String, required: true, maxlength: 100},
    lastname: {type: String, required: true, maxlength: 100},
    email: {type: String, required: true, maxlength: 100},
    password: {type: String, required: true, maxlength: 100},
        isAdmin: {type: Boolean, default:false}

  });

// Virtual for author's full name
User
.virtual('name')
.get(function () {

// To avoid errors in cases where an author does not have either a family name or first name
// We want to make sure we handle the exception by returning an empty string for that case

  var fullname = '';
  if (this.firstname && this.lastname) {
    fullname = this.firstname + ', ' + this.lastname;
  }
  if (!this.firstname || !this.lastname) {
    fullname = '';
  }

  return fullname;
});

// Virtual for bookinstance's URL
User
.virtual('url')
.get(function () {
  return '/users/' + this._id;
});


//Export model
module.exports = mongoose.model('User', User);
