package com.websoftware_26_1.petcare;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableJpaAuditing
@EnableAsync
public class PetcareApplication {

	public static void main(String[] args) {
		SpringApplication.run(PetcareApplication.class, args);
	}

}
