var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Place = new Schema(
  {
    name: {type: String, required: true, maxlength: 200},
    city: {type: String, required: true, maxlength: 100},
    country: {type: String, required: true, maxlength: 100},
    description: {type: String, required: true, maxlength: 1000},
    valid: {type: Boolean, default:false}
  }
);

// Virtual for author's full name
Place.virtual('place_id').get(function() {

return this._id;

});

Place
.virtual('location')
.get(function () {

// To avoid errors in cases where an author does not have either a family name or first name
// We want to make sure we handle the exception by returning an empty string for that case

  var fullname = '';
  if (this.city && this.country) {
    fullname = this.city + ', ' + this.country;
  }
  if (!this.city || !this.country) {
    fullname = '';
  }

  return fullname;
});

// Virtual for bookinstance's URL
Place
.virtual('url')
.get(function () {
  return '/places/' + this._id;
});


//Export model
module.exports = mongoose.model('Place', Place);
