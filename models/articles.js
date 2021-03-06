var mongoose = require("mongoose");


var Schema = mongoose.Schema;

var articleSchema = new Schema({
	title: {
		type: String,
		required: true
	},
	summary: {
		type: String,
		required: true
	},
	link: {
		type: String,
		required: true
	},
	note: {
		type: Schema.Types.ObjectId,
    	ref: "Note"
	},
	saved: {
		type: Boolean,
		default: false
	}
});

var article = mongoose.model("article", articleSchema);

module.exports = article;