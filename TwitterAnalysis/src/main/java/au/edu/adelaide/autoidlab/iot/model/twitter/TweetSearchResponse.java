package au.edu.adelaide.autoidlab.iot.model.twitter;

import java.util.List;

public class TweetSearchResponse {
	private List<TwitterInfo> tweets;
	
	public List<TwitterInfo> getTweets() {
		return tweets;
	}
	
	public void setTweets(List<TwitterInfo> tweets) {
		this.tweets = tweets;
	}
	
}
