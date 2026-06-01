package com.websoftware_26_1.petcare.domain;

import jakarta.persistence.*;

import java.time.LocalDate;
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
@Table(name = "animals", indexes = {
    @Index(name = "idx_animal_happen_dt", columnList = "happen_dt"),
    @Index(name = "idx_animal_org_nm", columnList = "org_nm"),
    @Index(name = "idx_animal_process_state", columnList = "process_state")
})
public class Animal {

    @Id
    @Column(name = "desertion_no", length = 30)
    private String desertionNo;

    @Column(name = "rfid_cd", length = 30)
    private String rfidCd;

    @Column(name = "notice_no", length = 50)
    private String noticeNo;

    @Column(name = "happen_dt")
    private LocalDate happenDt;

    @Column(name = "happen_place", length = 500)
    private String happenPlace;

    @Column(name = "up_kind_cd", length = 10)
    private String upKindCd;

    @Column(name = "up_kind_nm", length = 20)
    private String upKindNm;

    @Column(name = "kind_cd", length = 10)
    private String kindCd;

    @Column(name = "kind_nm", length = 100)
    private String kindNm;

    @Column(name = "kind_full_nm", length = 200)
    private String kindFullNm;

    @Column(name = "color_cd", length = 100)
    private String colorCd;

    @Column(length = 50)
    private String age;

    @Column(length = 50)
    private String weight;

    @Column(name = "notice_sdt")
    private LocalDate noticeSdt;

    @Column(name = "notice_edt")
    private LocalDate noticeEdt;

    @Column(name = "process_state", length = 50)
    private String processState;

    @Column(name = "end_reason", length = 200)
    private String endReason;

    @Column(name = "sex_cd", length = 1)
    private String sexCd;

    @Column(name = "neuter_yn", length = 1)
    private String neuterYn;

    @Lob
    @Column(name = "special_mark")
    private String specialMark;

    @Column(name = "sfe_soci", length = 500)
    private String sfeSoci;

    @Column(name = "sfe_health", length = 500)
    private String sfeHealth;

    @Column(name = "vaccination_chk", length = 500)
    private String vaccinationChk;

    @Column(name = "health_chk", length = 500)
    private String healthChk;

    @Lob
    private String popfiles;

    @Column(name = "evnt_img", length = 1000)
    private String evntImg;

    @Column(name = "adptn_title", length = 500)
    private String adptnTitle;

    @Lob
    @Column(name = "adptn_txt")
    private String adptnTxt;

    @Lob
    @Column(name = "adptn_condition_limit_txt")
    private String adptnConditionLimitTxt;

    @Column(name = "adptn_img", length = 1000)
    private String adptnImg;

    @Column(name = "adptn_s_date")
    private LocalDate adptnSDate;

    @Column(name = "adptn_e_date")
    private LocalDate adptnEDate;

    @Column(name = "sprt_s_date")
    private LocalDate sprtSDate;

    @Column(name = "sprt_e_date")
    private LocalDate sprtEDate;

    @Lob
    @Column(name = "srvc_txt")
    private String srvcTxt;

    @Column(name = "care_reg_no", length = 30)
    private String careRegNo;

    @Column(name = "care_nm", length = 200)
    private String careNm;

    @Column(name = "care_tel", length = 50)
    private String careTel;

    @Column(name = "care_addr", length = 500)
    private String careAddr;

    @Column(name = "care_owner_nm", length = 100)
    private String careOwnerNm;

    @Column(name = "org_nm", length = 200)
    private String orgNm;

    @Lob
    @Column(name = "etc_bigo")
    private String etcBigo;

    @Column(name = "upd_tm")
    private LocalDateTime updTm;

    @Lob
    @Column(name = "gemini_intro")
    private String geminiIntro;

    @Column(name = "cached_at")
    private LocalDateTime cachedAt;

    public void updateGeminiIntro(String geminiIntro, LocalDateTime cachedAt) {
        this.geminiIntro = geminiIntro;
        this.cachedAt = cachedAt;
    }
}
