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
      server.createContext("/", new RequestHandler());
      server.start();
      System.out.println("Started server on port 3000");
    } catch (IOException e) {
      System.out.println("IO Exception occurred: " + e.getMessage());
    } catch (Exception e) {
      System.out.println("An uncaught error occured: " + e.getMessage());
    }
  }
}

class RequestHandler implements HttpHandler {

  public void handle(HttpExchange exchange) {
    try {
      String requestMethod = exchange.getRequestMethod();

      if (requestMethod.equalsIgnoreCase("GET")) {
        this.handleGETRequests(exchange);
      } else if (requestMethod == "POST") {
        
      }
        
    } catch (Exception e) {
      System.err.println(e);
    }

  }

  public void handleGETRequests_(HttpExchange exchange) throws IOException {
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

  public void handleGETRequests(HttpExchange exchange) throws IOException, Exception {
    URI uri = exchange.getRequestURI();
    Path filePath = null;

    if (this.isBrowserPath(uri)) {
      filePath = this.createHTMLFilePath(uri);
    } else {
      filePath = this.createOtherFilePath(uri);
    }

    File file = filePath.toFile();

    if (file.canRead()) {
      this.respondWithFile(file, exchange);
    }

    System.out.println(filePath);
  }

  public void handlePOSTRequests() {
    
  }

  private Path createHTMLFilePath(URI uri) {
    if (uri.toString().equalsIgnoreCase("/")) {
      return Path.of(System.getProperty("user.dir"), "../frontend/html/home.html").normalize();
    } else {
      return Path.of(System.getProperty("user.dir"), "../frontend/html/", uri.toString() + ".html");
    }
  }

  private Path createOtherFilePath(URI uri) {
    return Path.of(System.getProperty("user.dir"), "../" + uri.toString()).normalize();
  }

  private void respondWithFile(File file, HttpExchange exchange) {
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

  private void respondWithError() {

  }

  private boolean isBrowserPath(URI uri) {
    
    if (MIMEHandler.hasRecognizedExtension(uri.toString())) {
      return false;
    } else {
      return true;
    }
  }

}