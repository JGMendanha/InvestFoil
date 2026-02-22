package br.edu.ufop.web.investmentapi.controller;

import br.edu.ufop.web.investmentapi.dto.InvestmentRequestDTO;
import br.edu.ufop.web.investmentapi.dto.InvestmentResponseDTO;
import br.edu.ufop.web.investmentapi.dto.SummaryDTO;
import br.edu.ufop.web.investmentapi.model.InvestmentType;
import br.edu.ufop.web.investmentapi.service.InvestmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/investments")
@RequiredArgsConstructor
public class InvestmentController {

    private final InvestmentService service;

    @PostMapping
    public ResponseEntity<InvestmentResponseDTO> create(@Valid @RequestBody InvestmentRequestDTO request) {
        InvestmentResponseDTO response = service.create(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<InvestmentResponseDTO>> findAll(
            @RequestParam(required = false) InvestmentType type) {
        List<InvestmentResponseDTO> list = service.findAll(type);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<InvestmentResponseDTO> findById(@PathVariable Long id) {
        InvestmentResponseDTO response = service.findById(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<InvestmentResponseDTO> update(
            @PathVariable Long id,
            @Valid @RequestBody InvestmentRequestDTO request) {
        InvestmentResponseDTO response = service.update(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/summary")
    public ResponseEntity<SummaryDTO> getSummary() {
        SummaryDTO summary = service.getSummary();
        return ResponseEntity.ok(summary);
    }

    // Diferencial: Atualizar preço de mercado (PATCH)
    @PatchMapping("/{id}/price")
    public ResponseEntity<InvestmentResponseDTO> updatePrice(
            @PathVariable Long id,
            @RequestParam BigDecimal newPrice) {
        InvestmentResponseDTO response = service.updateCurrentPrice(id, newPrice);
        return ResponseEntity.ok(response);
    }
}