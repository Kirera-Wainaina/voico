package online.voico.app.utils;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.nio.file.Path;

import org.junit.jupiter.api.Test;

// /**
//  * MIMEHandlerTest
//  */

public class MIMEHandlerTest {

  @Test
  public void testGetMIMETypeFromExtension() throws Exception {

    assertEquals("image/gif", MIMEHandler.getMIMETypeFromExtension(".gif"));

    String extension = ".pdf";
    Exception exception = assertThrows(
      Exception.class, 
      () -> MIMEHandler.getMIMETypeFromExtension(extension));
      assertEquals("Extension " + extension + " value not recognized", exception.getMessage());
  }

  @Test
  public void testGetExtensionFromMIMEType() throws Exception {

    assertEquals(".html", MIMEHandler.getExtensionFromMIMEType("text/html"));

    String mimetype = "application/pdf";
    Exception exception = assertThrows(Exception.class, () -> MIMEHandler.getExtensionFromMIMEType(mimetype));
    assertEquals("MIMEType " + mimetype + " not recognized", exception.getMessage());
  }

  @Test
  public void testHasRecognizedExtension() {
     assertTrue(MIMEHandler.hasRecognizedExtension("/app/test.html"));
     assertFalse(MIMEHandler.hasRecognizedExtension("/app/test.java"));
  }

  @Test
  public void testGetExtension() {
    assertEquals(".html", MIMEHandler.getExtension("/app/test.html"));
    assertEquals("", MIMEHandler.getExtension("/app/test"));
    assertEquals("", MIMEHandler.getExtension("/app/test."));

    Path path = Path.of("/app/test.html");
    assertEquals(".html", MIMEHandler.getExtension(path)); 
  }

  @Test
  public void testGetMIMETypeFromPath() throws Exception {
    assertEquals("text/html", MIMEHandler.getMIMETypeFromPath("/app/test.html"));
    assertEquals("", MIMEHandler.getMIMETypeFromPath("/app/test"));
  }

  @Test
  public void testHasExtension() {
    assertTrue(MIMEHandler.hasExtension("/app/test.pdf"));
    assertFalse(MIMEHandler.hasExtension("app."));
  }
}