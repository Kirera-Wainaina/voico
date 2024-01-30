import java.io.File;
import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.file.Files;
import java.nio.file.Path;

import com.sun.net.httpserver.Headers;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

public class App {

  public static void main(String[] args) {
    /**
     * Entry point into the app
     */

    try {
      HttpServer server = HttpServer.create(new InetSocketAddress("127.0.0.1", 3000), 0);
      server.createContext("/", new RequestHandler());
      server.start();
      System.out.println("Started server on port 3000");
    } catch (IOException e) {
      System.out.println("IO Exception occurred: " + e.getMessage());
    }
  }
}

class RequestHandler implements HttpHandler {

  public void handle(HttpExchange exchange) throws IOException {
    String requestMethod = exchange.getRequestMethod();
    // URI requestURI = exchange.getRequestURI();

    if (requestMethod.equalsIgnoreCase("GET")) {
      this.handleGETRequests(exchange);
    } else if (requestMethod == "POST") {
      
    }

  }

  public void handleGETRequests(HttpExchange exchange) throws IOException {
    Path homePagePath = Path.of(System.getProperty("user.dir"), "frontend/html/home.html")
      .normalize();
    File homepage = homePagePath.toFile();
    if (homepage.canRead()) {
      System.out.println("Called");
      OutputStream responseBody = exchange.getResponseBody();
      Headers headers = exchange.getResponseHeaders();
      byte[] fileBody = Files.readAllBytes(homePagePath);
      headers.set("content-type", "text/html");
      exchange.sendResponseHeaders(200, fileBody.length);
      responseBody.write(fileBody);
      responseBody.close();
    }
  }

  public void handlePOSTRequests() {
    
  }
}