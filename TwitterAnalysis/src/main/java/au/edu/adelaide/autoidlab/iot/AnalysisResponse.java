package au.edu.adelaide.autoidlab.iot;

import java.util.List;

import au.edu.adelaide.autoidlab.iot.model.keyword.ResponseItem;
import au.edu.adelaide.autoidlab.iot.model.twitter.Message;

public class AnalysisResponse {
	private List<Message> tweets;
	
	private List<ResponseItem> keywords;
	private List<ResponseItem> entities;
	private List<String> concepts;
	
	public List<Message> getTweets() {
		return tweets;
	}
	public void setTweets(List<Message> tweets) {
		this.tweets = tweets;
	}
	public List<ResponseItem> getKeywords() {
		return keywords;
	}
	public void setKeywords(List<ResponseItem> keywords) {
		this.keywords = keywords;
	}
	public List<ResponseItem> getEntities() {
		return entities;
	}
	public void setEntities(List<ResponseItem> entities) {
		this.entities = entities;
	}
	public void setConcepts(List<String> conceptList) {
		this.concepts = conceptList;
	}
	
	public List<String> getConcepts() {
		return concepts;
	}
	
	public int getTweetCount(){
		if (this.tweets!=null){
			return this.tweets.size();
		}else{
			return 0;
		}
	}
	
	public int getConceptCount(){
		if (this.concepts!=null){
			return this.concepts.size();
		}else{
			return 0;
		}
	}
	
	public int getKeywordCount(){
		if (this.keywords!=null){
			return this.keywords.size();
		}else{
			return 0;
		}
	}
	public int getEntityCount(){
		if (this.entities!=null){
			return this.entities.size();
		}else{
			return 0;
		}
	}
}
