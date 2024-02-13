package online.voico.app.api;

import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;

import org.apache.commons.fileupload.servlet.ServletFileUpload;

import com.sun.net.httpserver.HttpContext;
import com.sun.net.httpserver.HttpExchange;

public class Transcribe implements ApiInterface {

  public HttpExchange exchange;

  public Transcribe(HttpExchange exchange) {

    this.exchange = exchange; 
    System.out.println("Transcribe was called");
  }

  public void run() throws IOException {
    InputStream requestBody = exchange.getRequestBody();
    HttpContext context = exchange.getHttpContext();
    boolean isMultipart = ServletFileUpload.isMultipartContent();
    byte[] bytes = requestBody.readAllBytes();
    String bodyString = Arrays.toString(bytes); 
    

    System.out.println(bodyString);;
  }

}
