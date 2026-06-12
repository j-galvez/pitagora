package PitagoraBackend.util;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public final class EmailSubjectParser {

    private static final Pattern REPLY_PREFIX = Pattern.compile(
            "^(?i)(re|fw|fwd|rv|res|respuesta)\\s*:\\s*"
    );

    private static final Pattern SUBJECT_PATTERN = Pattern.compile(
            "(?i)ticket\\s*n[°º.o#]?\\s*(\\d+)\\s*,\\s*post\\s*venta\\s*,\\s*(.+)$"
    );

    private EmailSubjectParser() {}

    /**
     * Quita prefijos de respuesta/reenvío (Re:, Fwd:, etc.) de forma repetida.
     */
    public static String normalizarAsunto(String subject) {
        if (subject == null) return null;
        String s = subject.trim();
        Matcher m = REPLY_PREFIX.matcher(s);
        while (m.find()) {
            s = s.substring(m.end()).trim();
            m = REPLY_PREFIX.matcher(s);
        }
        return s;
    }

    /**
     * Parsea asunto con formato: Ticket N° X, Postventa, Nombre Obra
     */
    public static ParsedSubject parse(String subject) {
        String normalizado = normalizarAsunto(subject);
        if (normalizado == null || normalizado.isEmpty()) {
            return null;
        }

        Matcher matcher = SUBJECT_PATTERN.matcher(normalizado);
        if (!matcher.find()) {
            return null;
        }

        try {
            int ticketId = Integer.parseInt(matcher.group(1).trim());
            String nombreObra = matcher.group(2).trim();
            if (nombreObra.isEmpty()) {
                return null;
            }
            return new ParsedSubject(ticketId, nombreObra, normalizado);
        } catch (NumberFormatException e) {
            return null;
        }
    }

    public static boolean obraCoincide(String nombreAsunto, String nombreBd) {
        if (nombreAsunto == null || nombreBd == null) return false;
        return normalizarNombreObra(nombreAsunto).equalsIgnoreCase(normalizarNombreObra(nombreBd));
    }

    private static String normalizarNombreObra(String nombre) {
        return nombre.trim().replaceAll("\\s+", " ");
    }

    public static String generarAsuntoEstandar(int idTicket, String nombreObra) {
        return String.format("Ticket N° %d, Postventa, %s", idTicket, nombreObra);
    }

    public static class ParsedSubject {
        public final int idTicket;
        public final String nombreObra;
        public final String asuntoNormalizado;

        public ParsedSubject(int idTicket, String nombreObra, String asuntoNormalizado) {
            this.idTicket = idTicket;
            this.nombreObra = nombreObra;
            this.asuntoNormalizado = asuntoNormalizado;
        }
    }
}
