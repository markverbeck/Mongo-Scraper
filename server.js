var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");


var db = require("./models");

var PORT = 3000;


var app = express();



app.use(logger("dev"));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static("public"));


mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/mongoScraper", {
  
});

app.get("/scrape", function(req, res){
	axios.get("http://www.metalinjection.net/").then(function(response){
		var $ = cheerio.load(response.data);
		
		$("h2.title").each(function(i, element){
			var results = {};
			results.title = $(element).children("a").text();
			results.summary = $(element).next("p").next().text();
			results.link = $(element).children("a").attr("href");
			
			db.article.create(results).then(function(dbArticle){
				res.send("Scraped!");
			}).catch(function(err){
				res.json(err);
			});

		});

	})

});

app.get("/article", function(req, res){
	db.article.find({}).then(function(dbArticle){
		res.json(dbArticle);
	}).catch(function(err){
		res.json(err);
	});
});

app.put("/article/:id", function(req, res){
	db.article.update({_id: req.params.id}, {$set: {saved:true}}).then(function(dbArticle){
		alert("saved");
	}).catch(function(err){
		res.json(err);
	})
});

app.delete("/article/:id", function(req, res){
	db.article.remove({_id: req.params.id}).then(function(dbArticle){
		alert("deleted");
	}).catch(function(err){
		res.json(err);
	});
});


app.post("/article/:id", function(req, res) {
  console.log(req.body);
  db.note.create(req.body).then(function(dbNote) {
     
     return db.article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    }).then(function(dbArticle) {
      
      res.json(dbArticle);
    }).catch(function(err) {
      
      res.json(err);
    });
});

app.get("/article/:id", function(req, res){
	db.article.find({_id: req.params.id}).populate("note").then(function(dbArticle){
		res.json(dbArticle);
	}).catch(function(err){
		res.json(err);
	});
});




app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
