var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

const ax = require("axios");

var Recommendation = new Schema(
  {
    user_id: {type: ObjectId, maxlength: 100},
    place_id: {type: ObjectId, maxlength: 100}
    
  }
);
Recommendation
.virtual('user')
.get(async function () {

// To avoid errors in cases where an author does not have either a family name or first name
// We want to make sure we handle the exception by returning an empty string for that case
if (this._id) {
    let fullname,str;
  let res = await ax("/usersinfo/"+this.user_id);
                fullname=res.data;


  return fullname;
}
});

//Export model
module.exports = mongoose.model('Recommendation', Recommendation);
