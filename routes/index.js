var express = require('express');
var router = express.Router();
var db = require('monk')('localhost/mongo-associations-lesson')
var meetups = db.get('meetups')
var locations = db.get('locations')
var users = db.get('users')
var calls = require('../lib/mongo.js')

router.get('/', function(req, res, next) {
  meetups.find({}, function (err, documents) {
    if(err) throw err
    res.render('index', { meetups: documents });
  })
});

router.get('/meetups/:id', function(req,res,next){
  calls(req.params.id).then(function(master){
    console.log(master);
    res.render('show', master)
  })
})
module.exports = router;


//
// // router.get('/meetups/:id', function(req, res, next){
// //   calls.findMeetup(req.params.id).
// //   then(calls.addMeetupLocation).
// //   then(calls.addMeetupMembers).
// //   then(calls.addMeetupFollowers).
// //   then(calls.addMeetupsFollowed).then(function(master) {
// //     console.log(master);
// //     res.render('show', master)
// //   })
// // });

// router.get('/meetups/:id', function(req, res, next){
//   getSomeData(req.params.id).then(function(result){
//     res.render('show', obj)
//   })
// })
