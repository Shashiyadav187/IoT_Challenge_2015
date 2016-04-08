function tw_api_call(type,query, latLng, sentiment, cb) {
	$("#twitterLoadingMessage").removeClass('hidden');

	var queryParams = [];
	var range = annotationChart.getVisibleChartRange();
	queryParams.push("start=" + Math.round(range.start.getTime()));
	queryParams.push("end=" + Math.round(range.end.getTime()));
	if (type==2) {
		queryParams.push("q=" + query);
	} else {
		queryParams.push("latlng=" + latLng);
	}

	if (sentiment != null && sentiment>0) {
		queryParams.push("snt=" + sentiment);
	}

	$.get("api/analyze?" + queryParams.join('&'), function(response) {
		cb(JSON.parse(response));
		$("#twitterLoadingMessage").addClass('hidden');
	});
}

function renderAll(twitter_data) {
	s = "";
	if (twitter_data.tweetCount == 0) {
		s += "<h2>No data available</h2>";
	} else {

		s += "<div class='row'>";
		s += "<div class='col-md-4'>" + renderKeywords(twitter_data) + "</div>";
		s += "<div class='col-md-4'>" + renderEntities(twitter_data) + "</div>";
		s += "<div class='col-md-4'>" + renderConcepts(twitter_data) + "</div>";
		s += "</div>"

		s += renderTweets(twitter_data);
	}

	return s;
}

function renderTweets(twitter_data) {
	s = "";
	s += "<h3>Tweets</h3>";
	s += "<div class='scroll'><ul class='list-group'>";
	for (var i = 0; i < twitter_data.tweets.length; i++) {
		s += "<li class='list-group-item'>"
				+ renderTweet(twitter_data.tweets[i]) + "</li>";
	}
	s += "</ul></div>";
	return s;
}

function renderTweet(tweet) {
	s = '<table class="tweet">';
	s += '<tr><td rowspan=2> <img src="' + tweet.actor.image
			+ '"\>      </td>  <td> <span class="tweet_displayname">'
			+ tweet.actor.displayName + '</span>  <span class="tweet_user">@'
			+ tweet.actor.preferredUsername
			+ '</span>  <span class="tweet_time"> on ' + tweet.postedTime
			+ '</span></td></tr>';
	s += '<tr><td> ' + tweet.body + '</td> </tr> </table>';

	return s;

}

function renderKeywords(twitter_data) {
	s = "";
	s += "<h3>Key Words</h3>";
	s += "<div class='scroll'><ul class='list-group'>";
	for (var i = 0; i < twitter_data.keywords.length; i++) {
		s += "<li class='list-group-item'>" + twitter_data.keywords[i].text
				+ "</li>";
	}
	s += "</ul></div>";
	return s;
}

function renderEntities(twitter_data) {
	s = "";
	s += "<h3>Entities</h3>";
	s += "<div class='scroll'><ul class='list-group'>";
	for (var i = 0; i < twitter_data.entities.length; i++) {
		s += "<li class='list-group-item'>" + twitter_data.entities[i].text
				+ "</li>";
	}
	s += "</ul></div>";
	return s;
}

function renderConcepts(twitter_data) {
	s = "";
	s += "<h3>Concepts</h3>";
	s += "<div class='scroll'><ul class='list-group'>";
	for (var i = 0; i < twitter_data.concepts.length; i++) {
		s += "<li class='list-group-item'>" + twitter_data.concepts[i]
				+ "</li>";
	}
	s += "</ul></div>";
	return s;
}
