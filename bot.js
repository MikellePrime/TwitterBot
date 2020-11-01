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

// The hashtag of the tweet(s) the bot will like and reply to
hashtags = ["#PharrellWilliams", "#Maroon5", "#JustinBieber", "#Coldplay", "#RedHotChiliPeppers"]
var ranHash = hashtags[Math.floor(Math.random() * hashtags.length)];
var postSearch = {q: ranHash, count: 2, result_type: "mixed"};

// This function finds a tweet and likes and replies to it
function like() {
	T.get('search/tweets', postSearch, function (error, data) {
		// log out any errors and responses
		console.log(error, data);
  	    // Likes the post if the search (or the actual liking) doesn't have an error
		// likeId is the id of the like and commented post
		if (!error) {
			var likeId = data.statuses[0].id_str;
			T.post('favorites/create', {id: likeId}, function(error, response) {
				console.log(response);
				if (error) {
					console.log("something wrong here :(")
					console.log(error);
				} else {
					console.log("all good...check the bot, it liked something!");
				}
			// Here is where the function adds a comment
			var handle = data.statuses[0].user.screen_name;
			var name = data.statuses[0].user.name;
			var congratsMessages = [" this is amazing!👏👏👏", " wow!", " really cool!"];
			var ranMess = congratsMessages[Math.floor(Math.random() * congratsMessages.length)];
			var replyMessage = "@" + handle + ranMess;
			T.post('statuses/update', {in_reply_to_status_id: likeId, status: replyMessage}, function (error, response) {
				console.log(response);
				if (error) {
					console.log("something wrong here :(")
					console.log(error);
				} else {
					console.log("Success! The bot just added a comment!");
				}

			})
		})
	 } else {
		  console.log("There was an error with the hashtag search: ", error);

	 }
    });
}


// This function allows the bot to post periodically themed content

// Calling functions as soon as we run the program...
retweetLatest();
like();
// ...and then every hour after that. Time here is in milliseconds, so
// 1000 ms = 1 second, 1 sec * 60 = 1 min, 1 min * 60 = 1 hour --> 1000 * 60 * 60
setInterval(retweetLatest, 1000 * 60 * 60);
// the bot is set to like a #music post every 45minutes...same conversion as above
setInterval(like, 1000 * 60 * 45);
