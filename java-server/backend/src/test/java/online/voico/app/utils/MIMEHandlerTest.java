package online.voico.app.utils;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

// /**
//  * MIMEHandlerTest
//  */

public class MIMEHandlerTest {

  @Test
  public void testGetMIMETypeFromExtension() throws Exception {

    assertEquals(MIMEHandler.getMIMETypeFromExtension(".gif"), "image/gif");

    String extension = ".pdf";
    Exception exception = assertThrows(
      Exception.class, 
      () -> MIMEHandler.getMIMETypeFromExtension(extension));
      assertEquals(exception.getMessage(), "Extension " + extension + " value not recognized");
  }

  @Test
  public void testGetExtensionFromMIMEType() throws Exception {

    assertEquals(MIMEHandler.getExtensionFromMIMEType("text/html"), ".html");

    String mimetype = "application/pdf";
    Exception exception = assertThrows(Exception.class, () -> MIMEHandler.getExtensionFromMIMEType(mimetype));
    assertEquals(exception.getMessage(), "MIMEType " + mimetype + " not recognized");
  }

  @Test
  public void testHasRecognizedExtension() {
     assertTrue(MIMEHandler.hasRecognizedExtension("/app/test.html"));
     assertFalse(MIMEHandler.hasRecognizedExtension("/app/test.java"));
  }
}