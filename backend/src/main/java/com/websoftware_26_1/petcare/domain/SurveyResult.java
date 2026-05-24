package com.websoftware_26_1.petcare.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "survey_results")
public class SurveyResult extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "q_upkind", length = 10)
    private String qUpkind;

    @Column(name = "q_sex_cd", length = 1)
    private String qSexCd;

    @Column(name = "q_neuter_yn", length = 1)
    private String qNeuterYn;

    @Column(name = "q_upr_cd", length = 10)
    private String qUprCd;

    @Column(name = "q_state", length = 20)
    private String qState;

    public void updateFrom(String upkind, String sexCd, String neuterYn, String uprCd, String state) {
        this.qUpkind = upkind;
        this.qSexCd = sexCd;
        this.qNeuterYn = neuterYn;
        this.qUprCd = uprCd;
        this.qState = state;
    }
}
