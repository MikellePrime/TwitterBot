/**
 * @author Austin Lindquist & Malachi Locke-Primus 
 */


// Our Twitter library
var Twit = require('twit');
var T = new Twit(require('./config.js'));

// This is the URL of a search for the latest tweets on the '#mediaarts' hashtag.
var musicSearch = {q: "#producer", count: 30, result_type: "mixed"};
var artistSearch = {q: "@slash", count: 1, resut_type: "recent"};

// This function finds a tweet with the #producer hashtag, and retweets it.
function retweetLatest() {
	T.get('search/tweets', musicSearch, function (error, data) {
	  // log out any errors and responses
	  console.log(error, data);
	  // If our search request to the server had no errors...
	  if (!error) {
	  	// ...then we grab the ID of the tweet we want to retweet...
		var retweetId = data.statuses[0].id_str;
		// ...and then we tell Twitter we want to retweet it!
		T.post('statuses/retweet/' + retweetId, { }, function (error, response) {
			if (response) {
				console.log('Success! Check your bot, it should have retweeted something.')
			}
			// If there was an error with our Twitter call, we print it out here.
			if (error) {
				console.log('There was an error with Twitter:', error);
			}
		})
		T.post('favorites/create', {id: retweetId}, function (error, response) {
			console.log(response);
			if (error) {
				console.log("something wrong here :(")
				console.log(error);
			} else {
				console.log("we guud  :)")
			}
		})
	  }
	  // However, if our original search request had an error, we want to print it out here.
	  else {
	  	console.log('There was an error with your hashtag search:', error);
	  }
	});
}
// function tweet() {
//	T.post('statuses/update', { }, function(error, response) {})}
// function retweetArtist() {}
/*
function like() {
	T.get('search/')
}*/
// function postPhoto() {}
// function commentLatest() {}

// Try to retweet something as soon as we run the program...
retweetLatest();
// ...and then every hour after that. Time here is in milliseconds, so
// 1000 ms = 1 second, 1 sec * 60 = 1 min, 1 min * 60 = 1 hour --> 1000 * 60 * 60
setInterval(retweetLatest, 1000 * 60 * 60);
