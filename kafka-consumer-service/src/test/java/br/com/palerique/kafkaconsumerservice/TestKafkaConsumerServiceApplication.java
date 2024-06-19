package br.com.palerique.kafkaconsumerservice;

import org.springframework.boot.SpringApplication;

public class TestKafkaConsumerServiceApplication {

	public static void main(String[] args) {
		SpringApplication.from(KafkaConsumerServiceApplication::main).with(TestcontainersConfiguration.class).run(args);
	}

}
