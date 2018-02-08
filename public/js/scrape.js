

$.getJSON("/article", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    if(data[i].saved === false){
    	var article = "<div id=" + data[i]._id + " class='panel panel-default'>";
    	article += "<div class='panel-heading'><a href='" + data[i].link + "'>" + data[i].title + "</a><button data-id=" + data[i]._id + " id='save' class='btn-success'>Save Article</button></div>";
    	article += "<div class='panel-body'>" + data[i].summary + "</div></div>";

    	$("#articles").append(article);
	}else{
		var article = "<div class='panel panel-default'>";
    	article += "<div class='panel-heading'><a href='" + data[i].link + "'>" + data[i].title + "</a><button data-id=" + data[i]._id + " id='note' class='btn-success' data-toggle='modal' data-target='#myModal'>Article Notes</button><button data-id=" + data[i]._id + " id='delete' class='btn-danger'>Delete Article</button></div>";
    	article += "<div class='panel-body'>" + data[i].summary + "</div></div>";
    	$("#savedArticles").append(article);
	}
  }
});




$("#scrape").on("click", function(){

	$.getJSON("/scrape", function(data){
	alert("Articles Scraped!");
	location.reload(true);
	});

});

$(document).on("click","#save", function(){
	var id = $(this).attr('data-id');
	$.ajax({
		method: "PUT",
		url: "/article/" + id
	}).done(function(data){
		location.reload(true);
	});
});

$(document).on("click", "#delete", function(){
	var id = $(this).attr('data-id');
	$.ajax({
		method: "DELETE",
		url: "/article/" + id
	}).done(function(data){
		location.reload(true);
	});
});

$(document).on("click", "#note", function(){
	$("#notes").empty();
 
  var id = $(this).attr("data-id");
	$.ajax({
    method: "GET",
    url: "/article/" + id
  }).done(function(data) {
      // console.log(data);
     
      $("#notes").append("<h2>" + data[0].title + "</h2>");
      $("#notes").append("<h3>Title</h3>");
      $("#notes").append("<input id='titleinput' name='title' >");
      $("#notes").append("<h3>Body</h3>");
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      $("#notes").append("<button data-id='" + data[0]._id + "' id='savenote'>Save Note</button>");
	  if (data[0].note) {
        $("#titleinput").val(data[0].note.title);
        $("#bodyinput").val(data[0].note.body);
      }
    });
  
});

$(document).on("click", "#savenote", function(){
	var id = $(this).attr("data-id");
	$.ajax({
		method: "POST",
		url: "/article/" + id,
		data: {
			title: $("#titleinput").val(),
			body: $("#bodyinput").val()
		}
	}).done(function(data){
		console.log(data);
		$("#notes").empty();
	});
	$("#titleinput").val("");
  	$("#bodyinput").val("");
});