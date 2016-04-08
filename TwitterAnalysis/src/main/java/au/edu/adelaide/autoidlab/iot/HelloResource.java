package au.edu.adelaide.autoidlab.iot;

import javax.ws.rs.GET;
import javax.ws.rs.Path;

import com.google.gson.Gson;


@Path("/hello")
public class HelloResource {

	@GET
	public String getInformation() {

		// 'VCAP_APPLICATION' is in JSON format, it contains useful information about a deployed application
		// String envApp = System.getenv("VCAP_APPLICATION");

		// 'VCAP_SERVICES' contains all the credentials of services bound to this application.
		
		return "Hi servevice";

	}
}