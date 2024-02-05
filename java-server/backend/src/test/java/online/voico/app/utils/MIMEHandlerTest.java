package online.voico.app.utils;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

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

}