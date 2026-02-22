package br.edu.ufop.web.investmentapi.repository;

import br.edu.ufop.web.investmentapi.model.Investment;
import br.edu.ufop.web.investmentapi.model.InvestmentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InvestmentRepository extends JpaRepository<Investment, Long> {
    List<Investment> findByType(InvestmentType type);
}