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
    master.mainArray = filter(master.mainArray, currentId)
    return master
  }).then(function(master){
    return meetups.find({_id:{$in: master.mainArray}}).then(function(meetups){
      master.followedMeetups = meetups;
      return master
    })
  })
}

// FUNCTIONS 

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
  array = array.filter(function(elements){
    return elements != Id
  })
  return array;
}

module.exports=calls
