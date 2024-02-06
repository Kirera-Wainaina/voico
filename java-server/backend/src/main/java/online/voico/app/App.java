package online.voico.app;

import java.io.File;
import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;

import com.sun.net.httpserver.Headers;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import online.voico.app.utils.MIMEHandler;

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
      // this.respondWithError("An error occurred on the server", 500, exchange);
    }

  }

}

/**
 * RequestHandler
 */
class RequestHandler {

  public HttpExchange exchange;

  public RequestHandler(HttpExchange exchange) {
    this.exchange = exchange;
  }

  public void respondWithError(String msg, int errorCode) {

    try (OutputStream responseBody = exchange.getResponseBody()) {
      Headers headers = exchange.getResponseHeaders();
      String htmlString = "<h1>" + msg + "</h1>";
      byte[] msgBytes = htmlString.getBytes(); 

      headers.set("content-type", "text/html");
      exchange.sendResponseHeaders(errorCode, msgBytes.length);;
      responseBody.write(msgBytes);
    } catch (Exception e) {
      System.err.println(e);
    }
  }

}

class GETRequestHandler extends RequestHandler{

  public GETRequestHandler(HttpExchange exchange) {
    super(exchange);
  }

  public void handleGETRequests() throws IOException, Exception {
    URI uri = this.exchange.getRequestURI();
    Path filePath = null;

    if (this.isBrowserPath(uri)) {
      filePath = this.createHTMLFilePath(uri);
    } else {
      filePath = this.createOtherFilePath(uri);
    }

    File file = filePath.toFile();

    if (file.canRead()) {
      this.respondWithFile(file);
    } else {
      super.respondWithError("File was not found", 404);
    }

    System.out.println(filePath);
  }

  private boolean isBrowserPath(URI uri) {
    
    if (MIMEHandler.hasRecognizedExtension(uri.toString())) {
      return false;
    } else {
      return true;
    }
  }

  private Path createHTMLFilePath(URI uri) {
    if (uri.toString().equalsIgnoreCase("/")) {
      return Path.of(System.getProperty("user.dir"), "../frontend/html/home.html").normalize();
    } else {
      return Path.of(System.getProperty("user.dir"), "../frontend/html/", uri.toString() + ".html").normalize();
    }
  }

  private Path createOtherFilePath(URI uri) {
    return Path.of(System.getProperty("user.dir"), "../" + uri.toString()).normalize();
  }

  private void respondWithFile(File file) {
    try (OutputStream responseBody = exchange.getResponseBody()) {
      Headers headers = exchange.getResponseHeaders();
      byte[] filebody = Files.readAllBytes(Path.of(file.getAbsolutePath()));

      headers.set("content-type", MIMEHandler.getMIMETypeFromPath(file.getAbsolutePath()));
      exchange.sendResponseHeaders(200, filebody.length);
      responseBody.write(filebody);
  
    } catch (Exception e) {
      System.err.println(e);
    }
  }
  
}