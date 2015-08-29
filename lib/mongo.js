var db = require('monk')('localhost/mongo-associations-lesson')
var meetups = db.get('meetups')
var locations = db.get('locations')
var users = db.get('users')

var calls = function(currentId){
  return meetups.findOne({_id:currentId}).then(function(oneMeetup){
    var master = {};
    master.meetup = oneMeetup;
    return master
  }).then(function(master){
    return locations.findOne({_id:master.meetup.locationId}).then(function(oneLocation){
      master.location = oneLocation;
      return master
    })
  }).then(function(master){
    return users.find({_id:{$in: master.meetup.memberIds}}).then(function(members){
      master.members = members
      return master
    })
  }).then(function(master){
    master.membersArray = createArray(master.members)
    return users.find({follows:{$in: [master.meetup._id]}}).then(function(followers){
      master.followers = followers;
      return master
    })
  }).then(function(master){
    master.followersArray = createArray(master.followers)
    return master
  }).then(function(master){
    master.mainArray = concatArrays(master.followersArray, master.membersArray)
    return master
  }).then(function(master){
    console.log('step 1');
    master.mainArray = filter(mainArray, currentId)
    console.log('step 2');
    return master
  })

  //   return meetups.find({_id:{$in: master.mainArray}}).then(function(meetups){
  //     master.followedMeetups = meetups
  //     return master
  //   })
  // })
}


function createArray(members){
  var array = []
  members.forEach(function(members){
    array = array.concat(members.follows)
  })
  return array
}

function concatArrays(array1, array2){
  var array = array1.concat(array2)
  return array
}

function filter(array, Id){
  console.log('in filter')
  array = array.filter(function(element){
    return element != Id
  })
  console.log(array, '!!!!!!!')
  return array;
}


  //       users.find({_id:{$in: oneMeetup.memberIds}}, function(err, members){
  //         array1 = [];
  //         members.forEach(function(members){
  //           array1 = array1.concat(members.follows)
  //         })
  //         users.find({follows:{$in:[oneMeetup._id]}}, function(err, followers){
  //           array2 = [];
  //           followers.forEach(function(followers){
  //             array2 = array2.concat(followers.follows)
  //           })
  //            array2 = array2.concat(array1)
  //            array2 = array2.filter(function(elements){
  //              return elements != req.params.id
  //            })
  //            meetups.find({_id:{$in: array2}}, function(err, followedMeetups){
  //             res.render('show', {
  //               meetup: oneMeetup,
  //               location: oneLocation,
  //               members: members,
  //               followers: followers,
  //               followedMeetups: followedMeetups
  //
  //            })
  //
  //         })
  //       })
  //     })
  //     })
  //   })
  // })







// var calls = {
//   findMeetup: function (meetupId, cb) {
//     return meetups.findOne({_id: meetupId}).then(function (meetup) {
//       var master = {}
//       master.meetup = meetup;
//       return master
//     })
//   },
//
//   addMeetupLocation: function (master) {
//     return locations.findOne({_id: master.meetup.locationId}).then(function (location) {
//       master.location = location
//       return master
//     })
//   },
//
//   addMeetupMembers: function (master) {
//     return new Promise(function(success){
//       users.find({_id:{$in: master.meetup.memberIds}}).then(function(members){
//         master.members = members
//         success(master)
//       })
//     })
//   },
//
//   addMeetupFollowers: function (master) {
//     return new Promise(function(success){
//       master.arrayOfMeetupsFollowedByMembers = arrayOfMeetupsFollowedByMembers(master.members)
//       users.find({follows:{$in:[master.meetup._id]}}).then(function(followers){
//         master.followers = followers
//         success(master)
//       })
//     })
//   },
//
//   addMeetupsFollowed: function(master){
//     return new Promise(function(success){
//       master.bigArray = concatenateArrays(master.arrayOfMeetupsFollowedByMembers, arrayOfMeetupsFollowedByFollowers(master.followers))
//       master.bigArray = removeMeetupId(master.meetup._id, master.bigArray)
//       meetups.find({_id:{$in: master.bigArray}}).then(function(meetupsFollowed){
//         master.meetupsFollowed = meetupsFollowed
//         success(master)
//       })
//     })
//   },
//
// }
//
//
// // FUNCTIONS
//
// // create an array of the meetup ids that members follow
// function arrayOfMeetupsFollowedByMembers(members){
//   var followersArray  = [];
//   members.forEach(function(members){
//     followersArray = followersArray.concat(members.follows);
//   })
//   return followersArray;
// };
//
// // create an array of the meetup id that followers follow
// function arrayOfMeetupsFollowedByFollowers(followers){
//   var meetupsArray = [];
//   followers.forEach(function(followers){
//     meetupsArray = meetupsArray.concat(followers.follows);
//   })
//   return meetupsArray;
// };
//
// // concatenate the two arrays
// function concatenateArrays(meetupsArray, followersArray){
//
//   meetupsArray = meetupsArray.concat(followersArray);
//   return meetupsArray;
// }
//
// // Remove the id of the meetup we are currently viewing
// function removeMeetupId(meetupId, meetupsArray){
//   meetupsArray = meetupsArray.filter(function(element){
//     return element != meetupId
//   })
//   return meetupsArray;
// }

module.exports=calls
