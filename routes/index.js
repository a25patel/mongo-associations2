var express = require('express');
var router = express.Router();
var db = require('monk')('localhost/mongo-associations-lesson')
var meetups = db.get('meetups')
var locations = db.get('locations')
var users = db.get('users')
var calls = require('../lib/mongo.js')

router.get('/', function(req, res, next) {
  meetups.find({})
.then(function (documents) {
    res.render('index', { meetups: documents });
  })
});

router.get('/meetups/:id', function(req, res, next){
  calls.findMeetup(req.params.id).
  then(calls.addMeetupLocation).
  then(calls.addMeetupMembers).
  then(calls.addMeetupFollowers).
  then(calls.addMeetupsFollowed).then(function(master) {
    console.log(master);
    res.render('show', master)
  })
});

module.exports = router;


// goal
// router.get('/meetups/:id', function(req, res, next){
//   getSomeData(req.params.id).then(function(result){
//     res.render('show', obj)
//   })
// })
// $in needs to have something in an array!



// router.get('/meetups/:id', function(req, res, next){
//   meetups.findOne({_id:req.params.id}).then(function(meetup){
//     locations.findOne({_id:meetup.locationId}).then(function(location){
//       users.find({_id:{$in:meetup.memberIds}}).then(function(members){
//         var followersArray = [];
//         members.forEach(function(members) {
//           followersArray = followersArray.concat(members.follows);
//         })
//         users.find({follows:{$in:[meetup._id]}}).then(function(followers){
//           var meetupsArray = [];
//           followers.forEach(function(followers){
//             meetupsArray = meetupsArray.concat(followers.follows);
//           })
//
//           meetupsArray = meetupsArray.concat(followersArray);
//           meetupsArray= meetupsArray.filter(function(ele){
//             return ele != req.params.id
//           })
//           meetups.find({_id:{$in: meetupsArray}}).then(function(followerMeetups){
//             res.render('show', {
//               documents: meetup,
//               location: location,
//               member: members,
//               follower: followers,
//               followerMeetup: followerMeetups
//             })
//           })
//         })
//       })
//     })
//   })
// });
