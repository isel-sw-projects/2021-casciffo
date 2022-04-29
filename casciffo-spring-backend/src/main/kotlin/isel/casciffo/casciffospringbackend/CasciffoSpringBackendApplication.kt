package isel.casciffo.casciffospringbackend

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.data.r2dbc.repository.config.EnableR2dbcRepositories
import org.springframework.web.reactive.config.EnableWebFlux

//@EnableWebFlux
@EnableR2dbcRepositories
@SpringBootApplication
class CasciffoSpringBackendApplication


fun main(args: Array<String>) {
	runApplication<CasciffoSpringBackendApplication>(*args)
}



//@Bean
// fun initializer(connectionFactory: ConnectionFactory?): ConnectionFactoryInitializer? {
//	val initializer = ConnectionFactoryInitializer()
//	if (connectionFactory != null) {
//		initializer.setConnectionFactory(connectionFactory)
//	}
//	val populator = ResourceDatabasePopulator(ClassPathResource("sql/create.sql"))
//	initializer.setDatabasePopulator(populator)
//	return initializer
//}
