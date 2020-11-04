/**
 * @author Austin Lindquist & Malachi Locke-Primus 
 * TwitterBot: Alan Cain; at:Gargame55196808 on Twitter
 */

//------------------------- WORDNIK MATERIAL -------------------------//
// Wordnik API:
var WordnikAPIKey = 'mcbx0wwfxqzd4twgvx0g8k9sblnw5zp9167toszz3ew3lvyal';
var request = require('request');
var inflection = require('inflection');
var pluralize = inflection.pluralize;
var capitalize = inflection.capitalize;
var singularize = inflection.singularize;
var wordfilter = require('wordfilter');
var templates;

// Wordnik URLS:
function randNounUrl(minCorpusCount, limit) {
	return "http://api.wordnik.com/v4/words.json/randomWords?hasDictionaryDef=false&includePartOfSpeech=noun&minCorpusCount=" 
	+ minCorpusCount + "&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=-1&limit=" + limit + "&api_key=" + WordnikAPIKey;
}

// Wordnik Helper Functions:
Array.prototype.pick = function() {
	return this[Math.floor(Math.random()*this.length)];
}
Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};


//------------------------- Alan Cain's Library of Phrases -------------------------//
var exclamations = [ // Comments meant simply for commenting on posts related to certain hashtags/musicians.
	"WOW!",
	"really cool!",
	"this is amazing!!!👏👏👏",
	"keep it up!!",
	"😍😍😍",
	"🤟",
	"🔥🔥🔥",
	"Awesome 👍",
	"Legend!!! 🙏",
	"❤️",
	"Love you! ❤️",
];
var interact_comments = [ // Comments meant for "interacting with others", or simply to have someone reply to Alan's comment(s).
	"any song recommendations??",
	"song?",
	"can someone recommend me any new artists to listen too?? kinda bored rn",
	"are you selling merch?",
	"Anyone in a band? Looking for new music",
];


//------------------------- TWITTER MATERIAL -------------------------//
// Twitter API:
var Twit = require('twit');
var T = new Twit(require('./config.js'));


// LIST OF SEARCHES:
//---------- List of Hashtags ----------//
var hashtagList = ["#producer", "#music", "#singer", "#beats", "#guitar",
 "#PharrellWilliams", "#Maroon5", "#JustinBieber", "#Coldplay", "#RedHotChiliPeppers"];

//---------- List of Artists ----------//
var artistList = ["@ZakkWyldeBLS", "@IAMJHUD", "@chancetherapper", "@aloeblacc", "@RealMichelle",
 "@KELLYROWLAND", "@Beyonce", "PostMalone", "@ClarkBeckham", "@MariahCarey"];

// Debugger Tool:
var debug = false;

//-------------------------------------------------- FUNCTIONS --------------------------------------------------//
// This function finds a tweet and likes and replies to it
function like() {
	var index = Math.floor(Math.random() * hashtagList.length);
	var ranHash = hashtagList[index];
	var postSearch = {q: ranHash, count: 2, result_type: "mixed"};

	// Finds a tweet to like:
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
			})

			var handle = data.statuses[0].user.screen_name;
			var ranMess = exclamations[Math.floor(Math.random() * exclamations.length)];
			var replyMessage = "@" + handle + " " + ranMess;

			// Here is where the function adds a comment
			T.post('statuses/update', {in_reply_to_status_id: likeId, status: replyMessage}, function (error, response) {
				console.log(response);
				if (error) {
					console.log("something wrong here :(")
					console.log(error);
				} else {
					console.log("Success! The bot just added a comment!");
				}
			})

			var check = Math.floor(Math.random() * 10);
			if (check < 5) {
				var interact = interact_comments[Math.floor(Math.random() * interact_comments.length)];
				T.post('statuses/update', {in_reply_to_status_id: likeId, status: interact}, function (error, response) {
					console.log(response);
					if (error) {
						console.log("something wrong here :(")
						console.log(error);
					} else {
						console.log("Success! The bot just added a comment!");
					}
				})
			}
		} else {
			console.log("There was an error with the hashtag search: ");
			console.log(error);
		}
    });
}


// RETWEET & LIKING w/ ARTIST:
function retweetArtist() {
	var index = Math.floor(Math.random() * artistList.length);
	var name = artistList[index];
	var artist = {q: name, count: 30, result_type: "recent"};

	// Finds a Tweet with a mentioned artist:
	T.get('search/tweets', artist, function (error, data) {
		console.log(error, data);
	  	if (!error) {
			var retweetId = data.statuses[0].id_str;
			// Retweeting a post:
			T.post('statuses/retweet/' + retweetId, { }, function (error, response) {
				if (error) {
					console.log("Something is wrong here: ");
					console.log(error);
				} else {
					console.log("Alan Cain has retweeted a post.  :)");
					console.log(response);
				}
			})

			// Liking the retweeted post:
			T.post('favorites/create', {id: retweetId}, function (error, response) {
				if (error) {
					console.log("Something is wrong here: ");
					console.log(error);
				} else {
					console.log("Alan Cain has liked the retweet.  :)");
					console.log(response);
				}
			})
		}

		// Error:
		else {
			console.log("There was an error with the hashtag search: ");
			console.log(error);
		}
	});
}


// RETWEET & LIKING w/ HASHTAG:
// - retweets and likes the latest post based off the list of hashtags.
function retweetLatest() {
	var index = Math.floor(Math.random() * hashtagList.length);
	var name = hashtagList[index]; // Alan Cain decides which hashtag to use.
	var hashtag = {q: name, count: 10, result_type: "recent"};

	// Finds a Tweet with chosen hashtag:
	T.get('search/tweets', hashtag, function (error, data) {
	  	console.log(error, data);
	  	if (!error) {
			var retweetId = data.statuses[0].id_str;

			// Retweeting a post:
			T.post('statuses/retweet/' + retweetId, { }, function (error, response) {
				if (error) {
					console.log("Something is wrong here: ");
					console.log(error);
				} else {
					console.log("Alan Cain has retweeted a post.  :)");
					console.log(response);
				}
			})

			// Liking the retweeted post:
			T.post('favorites/create', {id: retweetId}, function (error, response) {
				if (error) {
					console.log("Something is wrong here: ");
					console.log(error);
				} else {
					console.log("Alan Cain has liked the retweet.  :)");
					console.log(response);
				}
			})
	  	}

	  	// Error:
	  	else {
			console.log("There was an error with the hashtag search: ");
			console.log(error);
	  	}
	});
}


// TWEET:
// - tweets a random update on Alan Cain's account.
function tweet() {
	// Creating a unique phrase to tweet out:
	request(randNounUrl(5000,200), function(error, response, data) {
		// Error:
		if (error != null) {
			return;
		}
		nouns = eval(data); // list of nouns

		// Filters out bad nouns:
		for (var i = 0; i < nouns.length; i++) {
			if (wordfilter.blacklisted(nouns[i].word)) {
				console.log("Blacklisted: " + nouns[i].word);
				nouns.remove(nouns[i]);
				i--;
			}				
		}

		// Template of things to say:
		templates = [
			"Writing a song about " + pluralize(nouns.pick().word) + ". Should be fun!!",
			"Need some inspiration",
			"Stayed up all night dealing with the stupid " + pluralize(nouns.pick().word) + ". Could barely get work done.",
			"Traded my friend some " + pluralize(nouns.pick().word) + " for some plugins. Pretty good deal I say.",
			"My buddy is performing tonight at the " + capitalize(singularize(nouns.pick().word)) + " here in Atlanta! Come an see!",
			"Can somebody tell me where I can find some " + pluralize(nouns.pick().word) + "?",
			"New music is on its way!!",
			"Dreaming of " + pluralize(nouns.pick().word) + " and " + pluralize(nouns.pick().word),
			"Where are my fellow drummers at!!",
			"There are 3 things I cannot live without: " + capitalize(pluralize(nouns.pick().word)) + ", " + pluralize(nouns.pick().word) + ", and " + pluralize(nouns.pick().word) + ". ",
			"Who is your favorite artist?",
			"Had to redownload 2 dozen " + pluralize(nouns.pick().word) + " for my DAW thanks to the power outage.",
			"Hope everyone is having a good day! Enjoy the " + pluralize(nouns.pick().word) + " that life brings you."
		];
		var index = Math.floor(Math.random() * templates.length); // Selects the index of a phrase from the templates list.
		var tweet = templates[index]; // Selected phrase to tweet out.

		// Debug:
		if(debug) {
			console.log("Debug mode: ");
			console.log(tweet);
		} else {

			// Tweeting:
			T.post('statuses/update', {status: tweet}, function (error, response) {
				if (error != null){
					console.log("Somthing is wrong here: ");
					console.log(error);
				}
				else {
					console.log("Alan Cain has tweeted.  :)");
					console.log(response);
				}
			});
		}
	});
}



//---------- Calling Functions ----------//

like();
retweetArtist();
retweetLatest();
tweet();

// Intervals:
//NOTE* 1000 ms = 1 second, 1 sec * 60 = 1 min, 1 min * 60 = 1 hour --> 1000 * 60 * 60
setInterval(like, 1000 * 60 * 30) // likes a post every 30 minutes
setInterval(retweetArtist, 1000 * 60 * 60); //retweets by the hour
setInterval(retweetLatest, 1000 * 60 * 60); //retweets by the hour
setInterval(tweet, 1000 * 60 * 60 * 12); //tweets about twice a day

