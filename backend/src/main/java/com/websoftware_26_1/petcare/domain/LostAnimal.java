package com.websoftware_26_1.petcare.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "lost_animals")
public class LostAnimal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "rfid_cd", length = 30)
    private String rfidCd;

    @Column(name = "happen_dt")
    private LocalDateTime happenDt;

    @Column(name = "happen_addr", length = 500)
    private String happenAddr;

    @Column(name = "happen_addr_dtl", length = 500)
    private String happenAddrDtl;

    @Column(name = "happen_place", length = 500)
    private String happenPlace;

    @Column(name = "kind_cd", length = 200)
    private String kindCd;

    @Column(name = "color_cd", length = 100)
    private String colorCd;

    @Column(length = 50)
    private String age;

    @Column(name = "sex_cd", length = 1)
    private String sexCd;

    @Lob
    @Column(name = "special_mark")
    private String specialMark;

    @Column(name = "popfile", length = 1000)
    private String popfile;

    @Column(name = "call_name", length = 100)
    private String callName;

    @Column(name = "call_tel", length = 50)
    private String callTel;

    @Column(name = "org_nm", length = 200)
    private String orgNm;

    @Column(name = "cached_at")
    private LocalDateTime cachedAt;
}
