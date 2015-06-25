var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var request = require("request");
var	cheerio = require("cheerio");

mongoose.connect('mongodb://localhost/REIbot');

var REIbotSchema = mongoose.Schema({
	linkers: String
});
var Linkers = mongoose.model('Links',REIbotSchema);
catLinks = [];
//labelIds = [];
// figure out database.
var REIpriceSchema = mongoose.Schema({
	prodId : Number,
	title : String,
	price : String,
	updated : {type: Date, default: Date.now}
});
var Pricers = mongoose.model('Prices', REIpriceSchema);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(callback) {


var REIbot = {
	links : ['http://www.rei.com'],
	size : 1,
	labelIds : [],
	runbot: function(url,pageNumber) {
		//for (i=0;i<links.length;i++){
			//var url = REIbot.links[i];
// goal url
// http://www.rei.com/rest/search/results?ir=category%3Abackpacking-packs&r=category%3Abackpacking-packs&page=1&pagesize=500
		if (url.indexOf('/c/') == -1) {
			console.log('not a category');
		} else {
			var category;
			if (url.indexOf('/c/') != -1) {
				category = url.substr(url.indexOf('/c/')+3);
				category = category.replace(/\s/g, "");
			} else if (url.indexOf('/s/') != -1) {
				category = url.substr(url.indexOf('/s/') + 3);
			} else if (url.indexOf('/b/') != -1) {
				category = url.substr(url.indexOf('/b/') + 3);
			}
			if (category.indexOf('/') != -1) {
				category = category.substr(0,category.indexOf('/'));
			}
			urlOrigin = url;
			//console.log(url);
			var urlStart = "http://www.rei.com/rest/search/results?ir=category%3A"
			var urlEnd = "&page="+pageNumber+"&pagesize=90";
			url = urlStart  +category + urlEnd;//category + "&r=category%3A" +
			//console.log(url);
			//console.log(url);
		// make the call, save to the database
			var moreResults = true;

			var linkstart = /rei.com/;
			var login = /Login/;
			var wishlist = /WishlistHome/;
			
			//make variables to fill our database
			var prodId;
			var price;
			var title;

			request( {url:url,headers: {'User-Agent' : 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.101 Safari/537.36'}} , function (error, response, body) {
				if (error) {
					console.log("We’ve encountered an error: " + error);
				}
				else {
					// load a page into cheerio
					// grab the entire body.
					console.log(url);
					console.log(category);
					var $page = JSON.parse(body);
					// text = $page('body').html();
					for (name in $page['results']) {
						if ($page['results'][name]['prodId']){
							if (REIbot.labelIds.indexOf($page['results'][name]['prodId'])==-1){
							console.log($page['results'][name]['prodId']);
							console.log($page['results'][name]['title'])
							prodId = $page['results'][name]['prodId'];
							title = $page['results'][name]['title'];
							REIbot.labelIds.push(prodId);
							if  ($page['results'][name]['displayPrice']['priceDisplay']['price'] == null){
								price = $page['results'][name]['displayPrice']['priceDisplay']['salePrice'];
								console.log($page['results'][name]['displayPrice']['priceDisplay']['salePrice'])
							} else {
								price = $page['results'][name]['displayPrice']['priceDisplay']['price'];
								console.log($page['results'][name]['displayPrice']['priceDisplay']['price']);
								console.log(name);
							}

							var temp = new Pricers({
								prodId : prodId,
								title : title,
								price : price,
							});
							temp.save(function( err, temp) {
								if (err) return console.error(err);
							});}
						} else {
							moreResults = false;
						}
					}
					
						if (moreResults) {
							console.log(pageNumber);
							REIbot.runbot(urlOrigin,parseInt(pageNumber)+1);
						}
					
				} 
			});
		}
		REIbot.size = REIbot.size+1;
	}
};

	Linkers.find(function(err,items) {
		if (err) {console.log('error');}
		for (i=0;i<items.length;i++) {
			catLinks.push(items[i]['linkers']);
			//console.log(items[i]['linkers']);
			REIbot.runbot(items[i]['linkers'],1);
		}
	});
//REIbot.runbot('rei.com/c/knives-and-tools',1);
});
