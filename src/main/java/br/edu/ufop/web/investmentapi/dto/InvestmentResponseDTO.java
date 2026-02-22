package br.edu.ufop.web.investmentapi.dto;

import br.edu.ufop.web.investmentapi.model.InvestmentType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InvestmentResponseDTO {
    private Long id;
    private InvestmentType type;
    private String symbol;
    private Integer quantity;
    private BigDecimal purchasePrice;
    private LocalDate purchaseDate;
    private BigDecimal currentPrice;
    private BigDecimal profitLoss; // opcional, calculado
}