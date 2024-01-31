package utils;

import java.util.Hashtable;
import java.util.Map.Entry;

class MIMEHandler {

  private Hashtable<String, String> extensionToMIMEtypeHashtable = new Hashtable<>();

  private MIMEHandler() {
    extensionToMIMEtypeHashtable.put(".html", "text/html");
    extensionToMIMEtypeHashtable.put(".js", "text/javascript");
    extensionToMIMEtypeHashtable.put(".css", "text/css");
    extensionToMIMEtypeHashtable.put(".json", "application/json");
    extensionToMIMEtypeHashtable.put(".txt", "text/plain");
    extensionToMIMEtypeHashtable.put(".png", "image/png");
    extensionToMIMEtypeHashtable.put(".jpg", "image/jpg");
    extensionToMIMEtypeHashtable.put(".jpeg", "image/jpeg");
    extensionToMIMEtypeHashtable.put(".gif", "image/gif");
    extensionToMIMEtypeHashtable.put(".webp", "image/webp");
    extensionToMIMEtypeHashtable.put(".ico", "image/x-icon");
    extensionToMIMEtypeHashtable.put(".svg", "image/svg+xml");
    extensionToMIMEtypeHashtable.put(".wav", "audio/wav");
    extensionToMIMEtypeHashtable.put(".webm", "audio/webm");
    extensionToMIMEtypeHashtable.put(".mp4", "video/mp4");
    extensionToMIMEtypeHashtable.put(".woff", "application/font-woff");
    extensionToMIMEtypeHashtable.put(".ttf", "application/font-ttf");
    extensionToMIMEtypeHashtable.put(".eot", "application/vnd.ms-fontobject");
    extensionToMIMEtypeHashtable.put(".otf", "application/font-otf");
    extensionToMIMEtypeHashtable.put(".wasm", "application/wasm");
    extensionToMIMEtypeHashtable.put(".xml", "text/xml");
  }

  public static String getMIMETypeFromExtension(String extension) {
    MIMEHandler mimeHandler = new MIMEHandler();

    if (mimeHandler.extensionToMIMEtypeHashtable.containsKey(extension)) {
      return mimeHandler.extensionToMIMEtypeHashtable.get(extension);
    } else {
      throw new Error("Extension " + extension + " value not recognized");
    }
  }

  public static String getExtensionFromMIMEType(String MIMEType) {
    MIMEHandler mimeHandler = new MIMEHandler();
    Hashtable<String, String> table = mimeHandler.extensionToMIMEtypeHashtable;
    String extension = null;

    if (table.containsValue(MIMEType)) {
      for (Entry<String, String> entry: table.entrySet()) {
        if (entry.getValue().equalsIgnoreCase(MIMEType)) {
          extension = entry.getKey();
        }
      }
      return extension;
    } else {
      throw new Error("MIMEType " + MIMEType + " not recognized");
    }
  }

}