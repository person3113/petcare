package com.websoftware_26_1.petcare.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;
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
@Table(name = "shelters")
public class Shelter {

    @Id
    @Column(name = "care_reg_no", length = 30)
    private String careRegNo;

    @Column(name = "care_nm", nullable = false, length = 200)
    private String careNm;

    @Column(name = "org_nm", length = 200)
    private String orgNm;

    @Column(name = "division_nm", length = 50)
    private String divisionNm;

    @Column(name = "save_trgt_animal", length = 100)
    private String saveTrgtAnimal;

    @Column(name = "care_addr", length = 500)
    private String careAddr;

    @Column(name = "jibun_addr", length = 500)
    private String jibunAddr;

    @Column(precision = 10, scale = 7)
    private BigDecimal lat;

    @Column(precision = 10, scale = 7)
    private BigDecimal lng;

    @Column(name = "week_opr_stime", length = 10)
    private String weekOprStime;

    @Column(name = "week_opr_etime", length = 10)
    private String weekOprEtime;

    @Column(name = "week_cell_stime", length = 10)
    private String weekCellStime;

    @Column(name = "week_cell_etime", length = 10)
    private String weekCellEtime;

    @Column(name = "weekend_opr_stime", length = 10)
    private String weekendOprStime;

    @Column(name = "weekend_opr_etime", length = 10)
    private String weekendOprEtime;

    @Column(name = "weekend_cell_stime", length = 10)
    private String weekendCellStime;

    @Column(name = "weekend_cell_etime", length = 10)
    private String weekendCellEtime;

    @Column(name = "close_day", length = 100)
    private String closeDay;

    @Column(name = "vet_person_cnt")
    private Integer vetPersonCnt;

    @Column(name = "specs_person_cnt")
    private Integer specsPersonCnt;

    @Column(name = "medical_cnt")
    private Integer medicalCnt;

    @Column(name = "breed_cnt")
    private Integer breedCnt;

    @Column(name = "quarabtine_cnt")
    private Integer quarabtineCnt;

    @Column(name = "feed_cnt")
    private Integer feedCnt;

    @Column(name = "trans_car_cnt")
    private Integer transCarCnt;

    @Column(name = "care_tel", length = 50)
    private String careTel;

    @Column(name = "designation_date")
    private LocalDate designationDate;

    @Column(name = "data_std_dt")
    private LocalDate dataStdDt;

    @Column(name = "cached_at")
    private LocalDateTime cachedAt;
}
