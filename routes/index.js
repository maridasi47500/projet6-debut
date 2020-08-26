var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const db = mongoose.connection;
/* GET home page. */
router.get('/', function(req, res, next) {
    var co = req.session.loggedIn, uid;
    if (co){
        uid=req.session.login.id;
    }
    db.collection('places').find({valid: true}).toArray(function(err,resp){

  res.render('index', { title: 'Réseau social de voyages', co: co, uid:uid, places: resp });
});
});

module.exports = router;
