package com.websoftware_26_1.petcare.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "favorites")
@EntityListeners(AuditingEntityListener.class)
public class Favorite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "desertion_no", nullable = false, length = 30)
    private String desertionNo;

    @Column(name = "snap_kind_nm", length = 100)
    private String snapKindNm;

    @Column(name = "snap_img_url", length = 1000)
    private String snapImgUrl;

    @Column(name = "snap_care_tel", length = 50)
    private String snapCareTel;

    @Column(name = "snap_process_state", length = 50)
    private String snapProcessState;

    @Column(name = "snap_notice_edt")
    private LocalDate snapNoticeEdt;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
