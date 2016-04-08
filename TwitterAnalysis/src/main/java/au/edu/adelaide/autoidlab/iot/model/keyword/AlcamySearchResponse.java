package au.edu.adelaide.autoidlab.iot.model.keyword;

import java.util.List;

public class AlcamySearchResponse {
	private String status;
	private String totalTransactions;

	private List<Item> entities;
	private List<Item> keywords;
	private List<Item> concepts;

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getTotalTransactions() {
		return totalTransactions;
	}

	public void setTotalTransactions(String totalTransactions) {
		this.totalTransactions = totalTransactions;
	}

	public List<Item> getEntities() {
		return entities;
	}

	public void setEntities(List<Item> entities) {
		this.entities = entities;
	}

	public List<Item> getKeywords() {
		return keywords;
	}

	public void setKeywords(List<Item> keywords) {
		this.keywords = keywords;
	}

	public List<Item> getConcepts() {
		return concepts;
	}

	public void setConcepts(List<Item> concepts) {
		this.concepts = concepts;
	}

}
