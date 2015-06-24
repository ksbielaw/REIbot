var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var request = require("request");
var	cheerio = require("cheerio");

var REIbot = {
	links : ['http://www.rei.com'],
	size : 1,

	runbot: function(url,pageNumber) {
		//for (i=0;i<links.length;i++){
			//var url = REIbot.links[i];
// goal url
// http://www.rei.com/rest/search/results?ir=category%3Abackpacking-packs&r=category%3Abackpacking-packs&page=1&pagesize=500
		if (url.indexOf('/c/') == -1) {
			console.log('not a category');
		} else {
			category = url.substr(url.indexOf('/c/')+3);
			urlOrigin = url;
			//now do everything
			var urlStart = "http://www.rei.com/rest/search/results?ir=category%3A"
			var urlEnd = "&page="+pageNumber+"&pagesize=90";
			url = urlStart + category + "&r=category%3A" + category + urlEnd;
			console.log(url);
		// make the call, save to the database
			var moreResults = true;

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
						if ($page['results'][name]['prodId']){
							console.log($page['results'][name]['prodId']);
							if  ($page['results'][name]['displayPrice']['priceDisplay']['price'] == null){
								console.log($page['results'][name]['displayPrice']['priceDisplay']['salePrice'])
							} else {
								console.log($page['results'][name]['displayPrice']['priceDisplay']['price'])
								console.log(name);
							}
						} else {
							moreResults = false;
						}
					}
					if (moreResults) {
						REIbot.runbot(urlOrigin,parseInt(pageNumber)+1);
					}
				} else {
					console.log("We’ve encountered an error: " + error);
				}
			});
		}
		REIbot.size = REIbot.size+1;
	}
};

REIbot.runbot('rei.com/c/knives-and-tools',1);
