package au.edu.adelaide.autoidlab.iot.model.keyword;

import java.util.ArrayList;
import java.util.List;

public class ResponseItem {
	private String			text;
	private List<Integer>	indexes;
							
	public ResponseItem() {
		this.indexes = new ArrayList<Integer>();
	}
	
	public String getText() {
		return text;
	}
	
	public void setText(String text) {
		this.text = text;
	}
	
	public List<Integer> getIndexes() {
		return indexes;
	}
	
	public void setIndexes(List<Integer> indexes) {
		if (indexes==null){
			indexes = new ArrayList<Integer>();
		}
		this.indexes = indexes;
	}
	
}
