var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
let userSchema = require("./models/user");
let placeSchema = require("./models/place");
let commentSchema = require("./models/comment");
let recommendationSchema = require("./models/recommendation");
//Vaaar=db.collections.users.find().toArray()
//db.collections.users.insertOne({firstname:'oijm',lastname:'klij',password:'lkuh',email:"mmmmmmmmmmmefgsegeds",_id:new ObjectId)})
const db = mongoose.connection;

var app = express();
var ObjectId = require('mongodb').ObjectId; 

//connect to mongodb
const connection1=mongoose.connect('mongodb+srv://root:root@cluster0.8xn4k.mongodb.net/mydatabaseyooohooo?retryWrites=true&w=majority',
{
useNewUrlParser: true,
useUnifiedTopology: true
}).then(()=>console.log('connected to ongodb')).catch(()=>console.log('error'));

mongoose.set('useCreateIndex',true);

//creer base de donnees, metre le nom de la base d'abord dans la longue chaine
//et la base de donnees se cree toute seule
app.use(session({
secret:'HAPPYNEWYEAR',
resave:false,
saveUninitialized:false,
store:new MongoStore({mongooseConnection: mongoose.connection})
}));
//lancer le serveur,aller dans mongodb et aller dans connection

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  
  saveUninitialized: true,
  cookie: { secure: false,originalMaxAge: 365 * 24 * 60 * 60 * 1000,
  expires:false }
  
}));
function cryptpw(pw){
    return require("crypto").createHash("sha256").update(pw).digest("hex");
}

// catch 404 and forward to error handler

app.get('/signup',function(req,res){
    var admin = req.query.admin;
    admin = admin && admin === 'yesiamadmin' ? 'yes' : null;
res.render('register',{titrepage:'Register',ad:admin});

});
app.get('/signin',function(req,res){
res.render('signin',{titrepage:'Register'});

});

app.get('/get_users',function(req,res){

db.collection('recommmendations').find().toArray(function(err,resp){
  res.json(resp);
}); 
});
app.get('/get_places',function(req,res){
var q = req.query.id,id_mongo=ObjectId(q), myplace,comments;

var places=[],p,com;
            db.collections.places.aggregate([
   { $addFields: { place_id: "$_id"} },
{
    $lookup:
                {
                    from:"recommendations",
                    localField:"place_id",
                    foreignField:"place_id",
                    as:"recommendations"
                }
},
{
    $lookup:
                {
                    from:"comments",
                    localField:"place_id",
                    foreignField:"place_id",
                    as:"comments"
                }
},
	  {
    $unwind: {
      path: "$comments",
      "preserveNullAndEmptyArrays": true
    }
  }
]).toArray((err,resp)=>{
        console.log(resp);
        console.log(err);
          if (err) return res.send("erreur");
        res.send(resp);
});

//db.collection('places').findOne({_id: id_mongo}).then(function(resp,err){
//    myplace = resp;
//        db.collection('recommendations').find({place_id: q}).toArray(function(erreur2,elements2){
//            myplace.recom = elements2;
//            
//            db.collection('comments').find({place_id: q}).toArray(function(erreur3,elements3){
//                myplace.com = elements3;
//                        res.json(myplace);
//
//            });
//        });
//});    


//    db.collection('comments').find({place_id: resp._id}).toArray(function(erreur,elements){
//        resp.comment = elements;
//    });
//    
//    
//    
//    
//            myplace.comments = [];
//            db.collection('comments').find({place_id: q}).toArray(function(err,resp2){
//                comments = resp2.map(com=>{
//                    db.collection('users').findOne({_id: com.user_id}).toArray(function(err,userresp){
//                        console.log(userresp);
//                    });
//                });
//            });
//        }

//var addresses = db.collection('users').find({"_id":{"$in":["wt"]}}); 

});
          //db.collection('users').update({_id:book._id},{$set:{_id: new ObjectId()}});

app.post('/new_user', function(req,res){
    var q = req.query;
    var pw = cryptpw(q.pword);
    var ad = q.admin === "yes" ? true : false;
        console.log(ad);
var myId;
    var data={

        firstname:q.fname,
        lastname:q.lname,
        email:q.email,
        password:pw,
        isAdmin: ad
    };console.log(data);
    db.collections.users.findOne(data).then(existuser=>{
        if (!existuser) {
            data._id = new ObjectId();

            db.collections.users.insertOne(data,function(err, book){
                      if (err) return res.send(err);


              res.send(book.name + " saved to bookstore collection.");

            });
        }
    });
    

});
app.post('/new_connection',function(req,res){
var q = req.query, email = q.email, pw = cryptpw(q.pword),uid,isAdmin;
db.collection('users')
        .findOne({email: email, password: pw}, function(err,resp){
            uid=resp ? resp._id : null;
    console.log(resp);
            isAdmin=resp ? resp.isAdmin : null;
    console.log('res'+resp);
  if(uid) {
      req.session.loggedIn = true;
      if (!req.session.login) {
          req.session.login = {};
      }
      req.session.login.email = email;
      req.session.login.password = pw;
      req.session.login.id = uid;
      req.session.login.isAdmin = isAdmin;
      req.session.save();
      console.log(req.session.login);
      res.send('ok');
      } else {
      res.send('notok');
  }
}); 
});
app.post('/logout',function(req,res){
      if(req.session&&req.session.loggedIn){
          req.session.destroy();
      res.send('tentative_deconnexion_reussie');
      } else {
          res.send('tentative_connexion');
  }
});
app.get('/users/:id/edit',function(req,res){
    var id = req.params.id,co=(req.session && req.session.loggedIn), id_mongo = new ObjectId(id);
    console.log(id,co);
    if (co) {
db.collection('users').findOne({_id: id_mongo}, function(err,resp){
      if (err) return res.send(err);
    res.render('ed',{u: resp,title:'Editer mon profil',co:co,uid: id});
}); 
    } else {
        res.redirect('/signin');
    }
});

app.post('/users/:id/edit',function(req,res){
    var id = req.params.id,u=req.query,pw=cryptpw(u.pword), log=u.email, fname=u.fname, lname=u.lname, id_mongo = new ObjectId(id) || "0";
    if (pw && log && fname && lname){
db.collection('users')
        .update(
            { _id: id_mongo },
    {$set: { firstname: fname, lastname: lname, password: pw, email:log }}, function(err,resp){
          if (err) return res.send("ERREUR"+JSON.stringify(err));

    res.send(resp);
});
    }
});
//creer un nouveau lieu
app.get('/places/new',function(req,res){
    var co=(req.session && req.session.loggedIn);
    var ad=(req.session && req.session.loggedIn && req.session.login.isAdmin);//administrateur

    if (co) {
    res.status(200).render('ou',{title:'Creer un lieu',co:co,ad:ad});
    } else {
        res.redirect('/signin');
    }
});

//afficher un lieu
app.get('/places/:id',function(req,res){
    var id = req.params.id,co=(req.session && req.session.loggedIn), id_mongo = (id ? ObjectId(id) : null),myplace;
    uid=co ? req.session.login.id : null;
	let regexid=new RegExp(id);
	            db.collections.places.aggregate([
   { $addFields: { place_id: {$toString: "$_id"}} },
{
    $lookup:
                {
                    from:"recommendations",
                    localField:"place_id",
                    foreignField:"place_id",
                    as:"recommendations"
                }
},
{
    $lookup:
                {
                    from:"comments",
                    localField:"place_id",
                    foreignField:"place_id",
                    as:"comments"
                }
},
{
    $project:{
            _id:1,
            name:"$name",
            placeid:"$place_id",
            city:"$city",
            country:"$country",
            recommendations:"$recommendations",
            description:"$description",
            comments:"$comments"
        }
},
	{ $match: { _id: id_mongo}    }
]).toArray((err,resp)=>{
        console.log(resp);
        console.log(err);
      if (err) return res.send("erreur");
        myplace=resp[0];
	console.log(myplace);
                res.render('end',{u: myplace,title:myplace.name,co:co,pid:id,uid: uid});
});



});
app.get('/usersinfo/:id',function(req,res){
    var id = req.params.id, id_mongo = (id ? new ObjectId(id) : id);
    db.collection('users').findOne({_id: id_mongo}).then(function(resp,err){
        if (err) return res.send(err);
                var user=new userSchema(resp);
                res.send(user.name);
    });    
});

app.post('/new_place', function(req,res){
    var q = req.query;
    var data={
        name:q.name,
        city:q.city,
        country:q.count,
        description:q.descr
    };
    db.collections.places.findOne(data).then(placeexists=>{
        if (!placeexists){
    var place = new placeSchema(data);
    place.save(function (err, book) {
      if (err) return res.send("erreur"+JSON.stringify(err));
      res.send(book.name + " saved to bookstore collection.");
    }); 
        }
});
});
app.post('/comment', function(req,res){
    var q = req.query;
    var user={
        _id:ObjectId(q.user_id)

    };
    var place={
                _id:ObjectId(q.place_id)

    };
        db.collections.users.findOne(user).then((userexists,err2)=>{
        db.collections.places.findOne(place).then((placeexists,err1)=>{
console.log(err1,err2);
		var data={place_id: place._id,
		user_id:user._id,content:q.content};
        db.collections.comments.findOne(data).then(comexists=>{
		console.log(comexists);
            if (!comexists){
            var comment = new commentSchema(data);
            comment.save(function (err, book) {
              if (err) return res.send("erreur"+JSON.stringify(err));
              res.send(" saved to bookstore collection.");
            });
        	}
    });
    });
    });
});
app.post('/recommend', function(req,res){
    var q = req.query;
    var user={
        _id:ObjectId(q.user_id)

    };
    var place={
                _id:ObjectId(q.place_id)

    };
        db.collections.users.findOne(user).then((userexists,err2)=>{
        db.collections.places.findOne(place).then((placeexists,err1)=>{
console.log(err1,err2);
		var data={place_id: place._id,
		user_id:user._id};
        db.collections.recommendations.findOne(data).then(recomexists=>{
            if (!recomexists){
            var recommendation = new recommendationSchema(data);
            recommendation.save(function (err, book) {
              if (err) return res.send("erreur"+JSON.stringify(err));
              res.send(" saved to bookstore collection.");
            });
        	}
    });
    });
    });
});
//administration des lieux
app.get('/placesadmin',function(req,res){
    console.log(req.session.login);
    var coadmin=(req.session && req.session.loggedIn && req.session.login.isAdmin);
    if (coadmin) {
    db.collection('places').find({valid:false}).toArray(function(err,resp){
          if (err) return res.send("erreur"+JSON.stringify(err));
        res.status(200).render('ad',{title:'Administration des lieux',coadmin: coadmin,places:resp});
    }); 
    } else {
        res.status(200).render('errmsg',{title:'Erreur utilisateur',message:"Erreur, vous n'êtes pas administrateur."});
    }
});

//valider
app.post('/commitplace',function(req,res){
    var id=req.query.place_id,id_mongo = new ObjectId(id);
    db.collection('places')
        .updateOne(
            { _id: id_mongo },
    {$set: { valid: true}}, function(err,resp){
          if (err) return res.send("erreur"+JSON.stringify(err));

    res.send(JSON.stringify(resp));
    });
});

app.get('/drop_all',function(req,res){
   db.collection('places').remove( { } ); 
   db.collection('users').remove( { } ); 
   db.collection('recommendations').remove( { } ); 
   db.collection('comments').remove( { } ); 
   req.session.destroy();
   res.send('done');
});
app.post('/drop_all',function(req,res){
   db.collection('places').remove( { } ); 
   db.collection('users').remove( { } ); 
   db.collection('recommendations').remove( { } ); 
   db.collection('comments').remove( { } ); 
   req.session.destroy();
   res.send('done');
});
app.post('/searchplace',function(req,res){
	var q = req.query;
	console.log(q);
	let pourcentsql='[\\s\\S]+';
	var placestrmongo = q.searchplace.split(' ').join(pourcentsql);
	var regexpplace = new RegExp(placestrmongo,'i'); //i = case insensitive
	console.log(regexpplace);
    //db.collection('places').findOne({ name: { $regex: regexpplace } }).toArray(function(err,resp){
	    db.collections.places.aggregate([
   { $addFields: { place_id: "$_id"} },
{
    $lookup:
                {
                    from:"recommendations",
                    localField:"place_id",
                    foreignField:"place_id",
                    as:"recommendations"
                }
},
{
    $lookup:
                {
                    from:"comments",
                    localField:"place_id",
                    foreignField:"place_id",
                    as:"comments"
                }
},
{
    $project:{
            _id:1,
            name:"$name",
            placeid:"$place_id",
            city:"$city",
            country:"$country",
            nbrec:{ $cond: { if: { $isArray: "$recommendations" }, then: { $size: "$recommendations" }, else: "NA"} },
            nbcom:{ $cond: { if: { $isArray: "$comments" }, then: { $size: "$comments" }, else: "NA"} }
        }
},
   { $addFields: { resultObject: { $regexFind: { input: "$name", regex: regexpplace }  } } } 
]).toArray((err,resp)=>{
	console.log(resp);
	console.log(err);
          if (err) return res.send("erreur");
        res.send(JSON.stringify(resp.filter(x=>x.resultObject)));
});
          //if (err) return res.send("erreur");
        //res.status(200).json(resp);
    //}); 
});

app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
