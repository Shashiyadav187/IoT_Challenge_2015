package au.edu.adelaide.autoidlab.iot.model.twitter;

public class Message {
	private String	id;
	private String	objectType;
	private String	postedTime;
	private String	link;
	private String	body;
	private Actor	actor;
					
	public String getId() {
		return id;
	}
	
	public void setId(String id) {
		this.id = id;
	}
	
	public String getObjectType() {
		return objectType;
	}
	
	public void setObjectType(String objectType) {
		this.objectType = objectType;
	}
	
	public String getPostedTime() {
		return postedTime;
	}
	
	public void setPostedTime(String postedTime) {
		this.postedTime = postedTime;
	}
	
	public String getLink() {
		return link;
	}
	
	public void setLink(String link) {
		this.link = link;
	}
	
	public String getBody() {
		return body;
	}
	
	public void setBody(String body) {
		this.body = body;
	}
	
	public Actor getActor() {
		return actor;
	}
	
	public void setActor(Actor actor) {
		this.actor = actor;
	}
}
