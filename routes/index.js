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
        memArr = [];
        members.forEach(function(members){
          memArr = memArr.concat(members.follows);
        })
        users.find({follows:{$in:[oneMeetup._id]}}, function(err, followers){
          follArr = [];
          followers.forEach(function(followers){
            follArr = follArr.concat(followers.follows)
          })
          memArr = memArr.concat(follArr);
          memArr = memArr.filter(function(element){
            return element != req.params.id
          })
          meetups.find({_id:{$in: memArr}}, function(err, meetupsFollowed){
            res.render('show', {
              meetup: oneMeetup,
              location: oneLocation,
              members: members,
              followers: followers,
              meetupsFollowed: meetupsFollowed
            })
          })
        })
      })
    })
  })
});

module.exports = router;

//         users.find({follows:{$in:[oneMeetup._id]}}, function(err, followers){
//           followersArray = [];
//           followers.forEach(function(followers){
//             followersArray = followersArray.concat(followers.follows)
//           })
//           followersArray = followersArray.concat(membersArray)
//           followersArray = followersArray.filter(function(element){
//             return element != req.params.id
//           })
//           meetups.find({_id:{$in:followersArray}}, function(err, meetupsFollowed){
//             res.render('show', {
//               meetup: oneMeetup,
//               location: oneLocation,
//               members: members,
//               follower: followers,
//               followerMeetup: meetupsFollowed
//             })
//           })
//         })
//       })
//     })
//   })
// })


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
