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

router.get('/meetups/:id', function(req, res, next){
  meetups.findOne({_id:req.params.id}, function(err, meetup){
    locations.findOne({_id:meetup.locationId}, function(err, location){
      users.find({_id:{$in:meetup.memberIds}}, function(err, members){
        var followersArray = [];
        members.forEach(function(members) {
          followersArray = followersArray.concat(members.follows);
        })
        users.find({follows:{$in:[meetup._id]}}, function(err, followers){
          var meetupsArray = [];
          followers.forEach(function(followers){
            meetupsArray = meetupsArray.concat(followers.follows);
          })

          meetupsArray = meetupsArray.concat(followersArray);
          meetupsArray= meetupsArray.filter(function(ele){
            return ele != req.params.id
          })
          meetups.find({_id:{$in: meetupsArray}}, function(err, followerMeetups){
            res.render('show', {
            documents: meetup,
            location: location,
            member: members,
            follower: followers,
            followerMeetup: followerMeetups
            })
          })
        })
      })
    })
  })
});
module.exports = router;


// $in needs to have something in an array!
