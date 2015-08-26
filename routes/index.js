var express = require('express');
var router = express.Router();
var db = require('monk')('localhost/mongo-associations-lesson')
var meetups = db.get('meetups')
var locations = db.get('locations')
var users = db.get('users')

router.get('/', function(req, res, next) {
  meetups.find({}, function (err, documents) {
    if(err) throw err
    res.render('index', { meetups: documents });
  })
});

router.get('/meetups/:id', function(req,res,next){
  meetups.findOne({_id: req.params.id}, function(err, oneMeetup){
    locations.findOne({_id: oneMeetup.locationId}, function(err, oneLocation){
      users.find({_id:{$in: oneMeetup.memberIds}}, function(err, members){
        array1 = [];
        members.forEach(function(members){
          array1 = array1.concat(members.follows)
        })
        users.find({follows:{$in:[oneMeetup._id]}}, function(err, followers){
          array2 = [];
          followers.forEach(function(followers){
            array2 = array2.concat(followers.follows)
          })
           array2 = array2.concat(array1)
           array2 = array2.filter(function(elements){
             return elements != req.params.id
           })
           meetups.find({_id:{$in: array2}}, function(err, followedMeetups){
            res.render('show', {
              meetup: oneMeetup,
              location: oneLocation,
              members: members,
              followers: followers,
              followedMeetups: followedMeetups

           })

        })
      })
    })
    })
  })
})
module.exports = router;


// var calls = require('../lib/mongo.js')
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
