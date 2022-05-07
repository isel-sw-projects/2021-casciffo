package isel.casciffo.casciffospringbackend

import io.r2dbc.spi.ConnectionFactory
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.context.annotation.Bean
import org.springframework.core.io.ClassPathResource
import org.springframework.data.r2dbc.repository.config.EnableR2dbcRepositories
import org.springframework.r2dbc.connection.init.CompositeDatabasePopulator
import org.springframework.r2dbc.connection.init.ConnectionFactoryInitializer
import org.springframework.r2dbc.connection.init.ResourceDatabasePopulator
import org.springframework.web.reactive.config.EnableWebFlux


@EnableWebFlux
@EnableR2dbcRepositories
@SpringBootApplication
class CasciffoSpringBackendApplication


fun main(args: Array<String>) {
	runApplication<CasciffoSpringBackendApplication>(*args)
}

@Bean
fun initializer(connectionFactory: ConnectionFactory?): ConnectionFactoryInitializer? {
	val initializer = ConnectionFactoryInitializer()
	initializer.setConnectionFactory(connectionFactory!!)
	val populator = CompositeDatabasePopulator()
	populator.addPopulators(ResourceDatabasePopulator(ClassPathResource("sql/schema.sql")))
	populator.addPopulators(ResourceDatabasePopulator(ClassPathResource("sql/data.sql")))
	initializer.setDatabasePopulator(populator)
	return initializer
}