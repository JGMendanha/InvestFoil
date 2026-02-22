package br.edu.ufop.web.investmentapi.service;

import br.edu.ufop.web.investmentapi.dto.InvestmentRequestDTO;
import br.edu.ufop.web.investmentapi.dto.InvestmentResponseDTO;
import br.edu.ufop.web.investmentapi.dto.SummaryDTO;
import br.edu.ufop.web.investmentapi.exception.ResourceNotFoundException;
import br.edu.ufop.web.investmentapi.model.Investment;
import br.edu.ufop.web.investmentapi.model.InvestmentType;
import br.edu.ufop.web.investmentapi.repository.InvestmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InvestmentService {

    private final InvestmentRepository repository;

    @Transactional
    public InvestmentResponseDTO create(InvestmentRequestDTO request) {
        Investment investment = mapToEntity(request);
        investment.setCurrentPrice(request.getPurchasePrice());
        Investment saved = repository.save(investment);
        return mapToResponseDTO(saved);
    }

    @Transactional(readOnly = true)
    public List<InvestmentResponseDTO> findAll(InvestmentType type) {
        List<Investment> investments;
        if (type != null) {
            investments = repository.findByType(type);
        } else {
            investments = repository.findAll();
        }
        return investments.stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public InvestmentResponseDTO findById(Long id) {
        Investment investment = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Investment not found with id: " + id));
        return mapToResponseDTO(investment);
    }

    @Transactional
    public InvestmentResponseDTO update(Long id, InvestmentRequestDTO request) {
        Investment investment = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Investment not found with id: " + id));
        updateEntity(investment, request);
        Investment updated = repository.save(investment);
        return mapToResponseDTO(updated);
    }

    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Investment not found with id: " + id);
        }
        repository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public SummaryDTO getSummary() {
        List<Investment> investments = repository.findAll();
        BigDecimal totalInvested = investments.stream()
                .map(i -> i.getPurchasePrice().multiply(BigDecimal.valueOf(i.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<InvestmentType, BigDecimal> totalByType = new HashMap<>();
        for (Investment inv : investments) {
            BigDecimal amount = inv.getPurchasePrice().multiply(BigDecimal.valueOf(inv.getQuantity()));
            totalByType.merge(inv.getType(), amount, BigDecimal::add);
        }

        long assetCount = investments.size();

        return new SummaryDTO(totalInvested, totalByType, assetCount);
    }

    @Transactional
    public InvestmentResponseDTO updateCurrentPrice(Long id, BigDecimal newPrice) {
        Investment investment = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Investment not found with id: " + id));
        investment.setCurrentPrice(newPrice);
        Investment saved = repository.save(investment);
        return mapToResponseDTO(saved);
    }

    private Investment mapToEntity(InvestmentRequestDTO dto) {
        Investment inv = new Investment();
        inv.setType(dto.getType());
        inv.setSymbol(dto.getSymbol());
        inv.setQuantity(dto.getQuantity());
        inv.setPurchasePrice(dto.getPurchasePrice());
        inv.setPurchaseDate(dto.getPurchaseDate());
        return inv;
    }

    private void updateEntity(Investment inv, InvestmentRequestDTO dto) {
        inv.setType(dto.getType());
        inv.setSymbol(dto.getSymbol());
        inv.setQuantity(dto.getQuantity());
        inv.setPurchasePrice(dto.getPurchasePrice());
        inv.setPurchaseDate(dto.getPurchaseDate());
    }

    private InvestmentResponseDTO mapToResponseDTO(Investment inv) {
        BigDecimal profitLoss = null;
        if (inv.getCurrentPrice() != null) {
            profitLoss = inv.getCurrentPrice()
                    .subtract(inv.getPurchasePrice())
                    .multiply(BigDecimal.valueOf(inv.getQuantity()));
        }
        return InvestmentResponseDTO.builder()
                .id(inv.getId())
                .type(inv.getType())
                .symbol(inv.getSymbol())
                .quantity(inv.getQuantity())
                .purchasePrice(inv.getPurchasePrice())
                .purchaseDate(inv.getPurchaseDate())
                .currentPrice(inv.getCurrentPrice())
                .profitLoss(profitLoss)
                .build();
    }
}