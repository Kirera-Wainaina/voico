package online.voico.app;

import java.io.File;
import java.io.IOException;
import java.io.OutputStream;
import java.lang.reflect.Constructor;
import java.lang.reflect.Method;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;

import com.sun.net.httpserver.Headers;
import com.sun.net.httpserver.HttpExchange;

import online.voico.app.api.*;
import online.voico.app.utils.MIMEHandler;

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

/**
 * POSTRequestHandler
 */
class POSTRequestHandler extends RequestHandler {

  public POSTRequestHandler(HttpExchange exchange) {
    super(exchange);
  }

  public void handlePOSTRequests() {
    URI uri = exchange.getRequestURI();
    String pathString = uri.toString();

    System.out.println(pathString);

    if (isAPIRequest(pathString)) {
      String className = pathString.replaceAll("/api/", "online.voico.app.api.");
      
      try {
        Class<?> apiClass = Class.forName(className);
        Class<?> parameterList[] = new Class[1];
        parameterList[0] = HttpExchange.class;
        Constructor<?> apiConstructor = apiClass.getConstructor(parameterList);
        Object argList[] = new Object[1];
        argList[0] = exchange;
        Object newInstance = apiConstructor.newInstance(argList);
        Transcribe instance = (Transcribe)newInstance;
        instance.run();
      } catch (Exception e) {
        System.err.print(e);
        respondWithError("The API request couldn't be handled", 500);
      }
    }
  }

  private boolean isAPIRequest(String pathString) {
    return pathString.matches("/api/.+");
  }
}