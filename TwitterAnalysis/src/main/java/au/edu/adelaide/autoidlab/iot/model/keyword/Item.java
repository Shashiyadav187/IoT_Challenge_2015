package au.edu.adelaide.autoidlab.iot.model.keyword;

public class Item {

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	public Float getRelevance() {
		return relevance;
	}

	public void setRelevance(Float relevance) {
		this.relevance = relevance;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	private String text;
	private Float relevance;
	private String type;
	

}
