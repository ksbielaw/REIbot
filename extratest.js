var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var request = require("request");
var	cheerio = require("cheerio");

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
			request( {url:url,headers: {'User-Agent' : 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.101 Safari/537.36'}} , function (error, response, body) {
			if (!error) {
				// load a page into cheerio
				// grab the entire body.
				var $page = JSON.parse(body);

				// text = $page('body').html();
				for (name in $page['results']) {
				//	console.log($page['results'][name])
				console.log($page['results'][name]['prodId']);
					if  ($page['results'][name]['displayPrice']['priceDisplay']['price'] == null){
						console.log($page['results'][name]['displayPrice']['priceDisplay']['salePrice'])
					} else {
				console.log($page['results'][name]['displayPrice']['priceDisplay']['price'])
						
					}
				}
				//for (i=0;i<text.length;i++){
	// 				var link = text[i]['attribs']['href'];
	// 				if (link && link[0] == '/') {
	// 					wholelink = url + link;
	// 				}
	// 				if (wholelink && linkstart.test(wholelink) && REIbot.links.indexOf(link) == -1) {
	// 					REIbot.links[REIbot.links.length] = link;
	// 					console.log(wholelink);
	// 					if (!login.test(wholelink) && !wishlist.test(wholelink)) {
	// //						REIbot.runbot(wholelink);
	// 					}
	// 				}
	// 			}
			} else {
				console.log("We’ve encountered an error: " + error);
			}
			});
			REIbot.size = REIbot.size+1;
			//}
	}
};

REIbot.runbot('http://www.rei.com/rest/search/results?ir=category%3Abackpacking-packs&r=category%3Abackpacking-packs&page=1&pagesize=500');
