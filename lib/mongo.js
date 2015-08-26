var db = require('monk')('localhost/mongo-associations-lesson')
var meetups = db.get('meetups')
var locations = db.get('locations')
var users = db.get('users')

// TODO: redo this _without_ creating your own promises (so no new Promise anywhere)
// Promise is an object that has a then method which gets called when the async call is done

var calls = {
  findMeetup: function (meetupId, cb) {
    return meetups.findOne({_id: meetupId}).then(function (meetup) {
      var master = {}
      master.meetup = meetup;
      return master
    })
  },

  addMeetupLocation: function (master) {
    return locations.findOne({_id: master.meetup.locationId}).then(function (location) {
      master.location = location
      return master
    })
  },

  addMeetupMembers: function (master) {
    return new Promise(function(success){
      users.find({_id:{$in: master.meetup.memberIds}}).then(function(members){
        master.members = members
        success(master)
      })
    })
  },

  addMeetupFollowers: function (master) {
    return new Promise(function(success){
      master.arrayOfMeetupsFollowedByMembers = arrayOfMeetupsFollowedByMembers(master.members)
      users.find({follows:{$in:[master.meetup._id]}}).then(function(followers){
        master.followers = followers
        success(master)
      })
    })
  },

  addMeetupsFollowed: function(master){
    return new Promise(function(success){
      master.bigArray = concatenateArrays(master.arrayOfMeetupsFollowedByMembers, arrayOfMeetupsFollowedByFollowers(master.followers))
      master.bigArray = removeMeetupId(master.meetup._id, master.bigArray)
      meetups.find({_id:{$in: master.bigArray}}).then(function(meetupsFollowed){
        master.meetupsFollowed = meetupsFollowed
        success(master)
      })
    })
  },

}


// FUNCTIONS

// create an array of the meetup ids that members follow
function arrayOfMeetupsFollowedByMembers(members){
  var followersArray  = [];
  members.forEach(function(members){
    followersArray = followersArray.concat(members.follows);
  })
  return followersArray;
};

// create an array of the meetup id that followers follow
function arrayOfMeetupsFollowedByFollowers(followers){
  var meetupsArray = [];
  followers.forEach(function(followers){
    meetupsArray = meetupsArray.concat(followers.follows);
  })
  return meetupsArray;
};

// concatenate the two arrays
function concatenateArrays(meetupsArray, followersArray){

  meetupsArray = meetupsArray.concat(followersArray);
  return meetupsArray;
}

// Remove the id of the meetup we are currently viewing
function removeMeetupId(meetupId, meetupsArray){
  meetupsArray = meetupsArray.filter(function(element){
    return element != meetupId
  })
  return meetupsArray;
}

module.exports=calls
