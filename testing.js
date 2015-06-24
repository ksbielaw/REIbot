// // This file will be used to text my new module. 
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var request = require("request");
var	cheerio = require("cheerio");

//var url = "http://www.rei.com"; //seed url
var links = ["http://www.rei.com"]; //start with seed link

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/REIbot');

var REIbotSchema = mongoose.Schema({
	linkers: String
});
var Linklist = mongoose.model('Links', REIbotSchema);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(callback) {

var REIbot = {
	links : ['http://www.rei.com'],
	size : 1,
	runbot: function(url) {
		//for (i=0;i<links.length;i++){
			//var url = REIbot.links[i];
			console.log(url);
			var linkstart = /rei.com/;
			var login = /Login/;
			var wishlist = /WishlistHome/;
			request(url, function (error, response, body) {
			if (!error) {
				// load a page into cheerio
				// grab the entire body.
				var $page = cheerio.load(body);

				text = $page("a");
				for (i=0;i<text.length;i++){
					var link = text[i]['attribs']['href'];
					if (link && link[0] == '/') {
						wholelink = url + link;
					}
					if (wholelink && linkstart.test(wholelink) && REIbot.links.indexOf(link) == -1) {
						REIbot.links[REIbot.links.length] = link;
						console.log('length: '+REIbot.links.length+'current: ' + REIbot.size);
						var temp = new Linklist({
							linkers: wholelink
						});
						temp.save(function( err, temp) {
							if (err) return console.error(err);
						});
						if (!login.test(wholelink) && !wishlist.test(wholelink)) {
							REIbot.runbot(wholelink);
						}
					}
				}
			} else {
				console.log("We’ve encountered an error: " + error);
			}
			});
			REIbot.size = REIbot.size+1;
			//}
	}
};

REIbot.runbot('http://www.rei.com');

});