package com.websoftware_26_1.petcare.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "rescue_stats_cache")
public class RescueStatsCache {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "se", nullable = false, length = 20)
    private String se;

    @Column(name = "prcs_cd", length = 20)
    private String prcsCd;

    @Column(name = "prcs_nm", nullable = false, length = 100)
    private String prcsNm;

    @Column(name = "tot", nullable = false)
    private Integer tot;

    @Column(name = "bgnde", nullable = false)
    private LocalDate bgnde;

    @Column(name = "endde", nullable = false)
    private LocalDate endde;

    @Column(name = "cached_at", nullable = false)
    private LocalDateTime cachedAt;
}
