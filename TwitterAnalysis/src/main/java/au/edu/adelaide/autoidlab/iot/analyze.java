package au.edu.adelaide.autoidlab.iot;

import java.net.HttpURLConnection;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Date;
import java.util.List;
import java.util.TimeZone;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.Entity;
import javax.ws.rs.core.Form;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.google.gson.Gson;

import au.edu.adelaide.autoidlab.iot.model.keyword.AlcamySearchResponse;
import au.edu.adelaide.autoidlab.iot.model.keyword.Item;
import au.edu.adelaide.autoidlab.iot.model.keyword.ResponseItem;
import au.edu.adelaide.autoidlab.iot.model.twitter.Message;
import au.edu.adelaide.autoidlab.iot.model.twitter.TweetSearchResponse;
import au.edu.adelaide.autoidlab.iot.model.twitter.TwitterInfo;

@Path("/analyze")
public class analyze {
	
	private Client		twitterClient	= ClientBuilder.newClient();
	private String		auth			= "Basic "
			+ Base64.getEncoder().encodeToString(("4335e0bd-7778-44a2-946d-cfea17bcb59e:hoq39kiINV").getBytes());
			
	private String		twTargetUrl		= "https://cdeservice.au-syd.mybluemix.net:443/api/v1/messages/search";
										
	private Pattern		twitterBody		= Pattern.compile("(?<=\"body\":\").*?(?=\",\")");;
	private TimeZone	tz				= TimeZone.getTimeZone("UTC");
	private DateFormat	df				= new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ssX");
										
	private String		alApiKey		= "7d136d5a98ccfe1ef8f8b10375b5b3eed259c2b3";
	private String		alKeywordUrl	= "http://gateway-a.watsonplatform.net/calls/text/TextGetRankedKeywords";
	private Client		alKeywordClient	= ClientBuilder.newClient();
	private String		alEntityUrl		= "http://access.alchemyapi.com/calls/text/TextGetRankedNamedEntities";
	private Client		alEntityClient	= ClientBuilder.newClient();
	private String		alConceptUrl	= "http://gateway-a.watsonplatform.net/calls/text/TextGetRankedConcepts";
	private Client		alConceptClient	= ClientBuilder.newClient();
										
	private Logger		log				= Logger.getLogger(analyze.class.getName());
										
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public AnalysisResponse analize(@QueryParam("q") String q, @QueryParam("start") Long startTime,
			@QueryParam("end") Long endTime, @QueryParam("snt") Integer snt) {
			
		TweetSearchResponse bodyList = searchTwitter(q, startTime, endTime, snt);
		
		AnalysisResponse res = new AnalysisResponse();
		
		if (bodyList.getTweets()==null || bodyList.getTweets().isEmpty()){
			return res;
		}
		
		List<Message> tweets = new ArrayList<Message>();
		StringBuilder sb = new StringBuilder();
		for (TwitterInfo ti : bodyList.getTweets()) {
			String body = ti.getMessage().getBody();
			if (body.endsWith(".")){
				sb.append(body+"\n");
			}else{
				sb.append(body+".\n");
			}
			tweets.add(ti.getMessage());
			
		}
		
		AlcamySearchResponse keywords = extractKeyWords(sb);
		List<ResponseItem> keyWordList = new ArrayList<ResponseItem>();
		if (keywords.getKeywords() != null) {
			
			for (Item it : keywords.getKeywords()) {
				ResponseItem kw = new ResponseItem();
				kw.setText(it.getText());
				for (int i = 0; i < tweets.size(); i++) {
					if (tweets.get(i).getBody().contains(kw.getText())) {
						kw.getIndexes().add(i);
					}
				}
				keyWordList.add(kw);
			}
		}
		
		AlcamySearchResponse entities = extractEntities(sb);
		List<ResponseItem> entityList = new ArrayList<ResponseItem>();
		if (entities.getEntities() != null) {
			
			for (Item it : entities.getEntities()) {
				ResponseItem ent = new ResponseItem();
				ent.setText(it.getText());
				for (int i = 0; i < tweets.size(); i++) {
					if (tweets.get(i).getBody().contains(ent.getText())) {
						ent.getIndexes().add(i);
					}
				}
				entityList.add(ent);
			}
		}
		
		AlcamySearchResponse concepts = extractConcepts(sb);
		List<String> conceptList = new ArrayList<String>();
		if (concepts.getConcepts() != null) {
			
			for (Item it : concepts.getConcepts()) {
				conceptList.add(it.getText());
			}
		}
		
		res.setKeywords(keyWordList);
		res.setTweets(tweets);
		res.setEntities(entityList);
		res.setConcepts(conceptList);
		return res;
		
		// return q.toString();
		
	}
	
	private AlcamySearchResponse extractKeyWords(StringBuilder sb) {
		Response al = null;
		Form frm = new Form();
		frm.param("apikey", alApiKey).param("text", sb.toString()).param("outputMode", "json");
		al = alKeywordClient.target(alKeywordUrl).request()
				.post(Entity.entity(frm, MediaType.APPLICATION_FORM_URLENCODED_TYPE));
				
		if (al.getStatus() != 200) {
			throw new WebApplicationException(Response.status(HttpURLConnection.HTTP_INTERNAL_ERROR)
					.entity("Error communicating with alcamy keyword search:" + al.readEntity(String.class)).build());
		}
		AlcamySearchResponse res = new Gson().fromJson(al.readEntity(String.class), AlcamySearchResponse.class);
		return res;
	}
	
	private AlcamySearchResponse extractEntities(StringBuilder sb) {
		Response al = null;
		Form frm = new Form();
		frm.param("apikey", alApiKey).param("text", sb.toString()).param("outputMode", "json");
		al = alEntityClient.target(alEntityUrl).request()
				.post(Entity.entity(frm, MediaType.APPLICATION_FORM_URLENCODED_TYPE));
				
		if (al.getStatus() != 200) {
			throw new WebApplicationException(Response.status(HttpURLConnection.HTTP_INTERNAL_ERROR)
					.entity("Error communicating with alcamy entitiy extraction:" + al.readEntity(String.class))
					.build());
		}
		AlcamySearchResponse res = new Gson().fromJson(al.readEntity(String.class), AlcamySearchResponse.class);
		return res;
	}
	
	private AlcamySearchResponse extractConcepts(StringBuilder sb) {
		Response al = null;
		Form frm = new Form();
		frm.param("apikey", alApiKey).param("text", sb.toString()).param("outputMode", "json");
		al = alConceptClient.target(alConceptUrl).request()
				.post(Entity.entity(frm, MediaType.APPLICATION_FORM_URLENCODED_TYPE));
				
		if (al.getStatus() != 200) {
			throw new WebApplicationException(Response.status(HttpURLConnection.HTTP_INTERNAL_ERROR)
					.entity("Error communicating with alcamy concept extraction:" + al.readEntity(String.class))
					.build());
		}
		AlcamySearchResponse res = new Gson().fromJson(al.readEntity(String.class), AlcamySearchResponse.class);
		return res;
	}
	
	private TweetSearchResponse searchTwitter(String query, Long startTime, Long endTime, Integer snt) {
		df.setTimeZone(tz);
		StringBuilder q = new StringBuilder();
		if (startTime != null) {
			q.append("posted:");
			Date dt = new Date(startTime);
			q.append(df.format(dt));
			
			if (endTime != null) {
				dt = new Date(endTime);
				q.append(",").append(df.format(dt));
			}
		} else {
			throw new WebApplicationException(Response.status(HttpURLConnection.HTTP_BAD_REQUEST)
					.entity("start (start time) is mandatory").build());
		}
		
		// Handle location stuff
		
		if (query == null) {
			throw new WebApplicationException(
					Response.status(HttpURLConnection.HTTP_BAD_REQUEST).entity("query is mandatory").build());
		}
		
		q.append(" ");
		q.append(query);
		
		if (snt !=null){
			switch (snt.intValue()) {
			case 1:
				q.append(" sentiment:positive");
				break;
			case 2:
				q.append(" (sentiment:neutral OR sentiment:ambivalent)");
				break;
			case 3:
				q.append(" sentiment:negative");
				break;
			default:
				break;
			}
			
		}
		log.log(Level.INFO, q.toString());
		
		Response rs = this.twitterClient.target(twTargetUrl).queryParam("q", q).request()
				.accept(MediaType.APPLICATION_JSON).header("Authorization", auth).get();
		
		Gson gs = new Gson();
		TweetSearchResponse tresponse =gs.fromJson(rs.readEntity(String.class), TweetSearchResponse.class);
		
		return tresponse;
	}
	
}
