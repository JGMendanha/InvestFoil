package br.edu.ufop.web.investmentapi.dto;

import br.edu.ufop.web.investmentapi.model.InvestmentType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SummaryDTO {
    private BigDecimal totalInvested;
    private Map<InvestmentType, BigDecimal> totalByType;
    private long assetCount;
}