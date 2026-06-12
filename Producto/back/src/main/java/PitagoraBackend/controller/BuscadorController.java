package PitagoraBackend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import PitagoraBackend.dto.SearchResultDTO;
import PitagoraBackend.service.BuscadorService;

@RestController
@RequestMapping("/api/buscador")
@CrossOrigin(origins = "*")
public class BuscadorController {

    @Autowired
    private BuscadorService buscadorService;

    @GetMapping("/general")
    public ResponseEntity<List<SearchResultDTO>> buscarGeneral(@RequestParam("q") String query) {
        try {
            if (query == null || query.trim().length() < 2) {
                return ResponseEntity.ok(List.of());
            }
            return ResponseEntity.ok(buscadorService.buscarGeneral(query));
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
}
