package PitagoraBackend.util;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class EmailSubjectParserTest {

    @Test
    void parseFormatoEstandar() {
        var parsed = EmailSubjectParser.parse("Ticket N° 522, Postventa, Facultad Arquitectura UC");
        assertNotNull(parsed);
        assertEquals(522, parsed.idTicket);
        assertEquals("Facultad Arquitectura UC", parsed.nombreObra);
    }

    @Test
    void parseVariantes() {
        assertNotNull(EmailSubjectParser.parse("ticket n 522, post venta, Obra Test"));
        assertNotNull(EmailSubjectParser.parse("TICKET N° 10, POSTVENTA, Mi Obra"));
        assertNotNull(EmailSubjectParser.parse("ticket nº 7, Post Venta, Edificio Central"));
    }

    @Test
    void parseConPrefijoRe() {
        var parsed = EmailSubjectParser.parse("Re: Re: ticket n° 522, postventa, Facultad Arquitectura UC");
        assertNotNull(parsed);
        assertEquals(522, parsed.idTicket);
        assertEquals("Facultad Arquitectura UC", parsed.nombreObra);
    }

    @Test
    void parseAsuntoInvalido() {
        assertNull(EmailSubjectParser.parse("[PITAGORA-OBR-1-TKT-2-OBS-3] viejo formato"));
        assertNull(EmailSubjectParser.parse("Sin formato valido"));
    }

    @Test
    void generarAsuntoEstandar() {
        assertEquals("Ticket N° 522, Postventa, Facultad Arquitectura UC",
                EmailSubjectParser.generarAsuntoEstandar(522, "Facultad Arquitectura UC"));
    }

    @Test
    void obraCoincideIgnoraMayusculasYEspacios() {
        assertTrue(EmailSubjectParser.obraCoincide("  facultad arquitectura uc ", "Facultad Arquitectura UC"));
        assertFalse(EmailSubjectParser.obraCoincide("Otra Obra", "Facultad Arquitectura UC"));
    }
}
