package isel.casciffo.casciffospringbackend

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication


@SpringBootApplication
class CasciffoSpringBackendApplication


fun main(args: Array<String>) {
	runApplication<CasciffoSpringBackendApplication>(*args)
}
//TODO ADD SECURITY MIDDLEWARE TO VERIFY WHO'S MAKING THE CALL


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
