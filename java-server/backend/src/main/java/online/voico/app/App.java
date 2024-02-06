package online.voico.app;

import java.io.IOException;
import java.net.InetSocketAddress;

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
      server.createContext("/", new Handler());
      server.start();
      System.out.println("Started server on port 3000");
    } catch (IOException e) {
      System.out.println("IO Exception occurred: " + e.getMessage());
    } catch (Exception e) {
      System.out.println("An uncaught error occured: " + e.getMessage());
    }
  }
}

class Handler implements HttpHandler {

  public void handle(HttpExchange exchange) {
    try {
      String requestMethod = exchange.getRequestMethod();

      if (requestMethod.equalsIgnoreCase("GET")) {
        GETRequestHandler getRequestHandler = new GETRequestHandler(exchange);
        getRequestHandler.handleGETRequests();
      } else if (requestMethod == "POST") {
        
      }
        
    } catch (Exception e) {
      System.err.println(e);

      // send an error message in the off chance this ever happened
    }

  }

}

