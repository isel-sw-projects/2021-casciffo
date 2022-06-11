package isel.casciffo.casciffospringbackend.config

import org.springframework.context.annotation.Configuration
import org.springframework.data.r2dbc.repository.config.EnableR2dbcRepositories
import org.springframework.scheduling.annotation.EnableScheduling
import org.springframework.web.reactive.config.CorsRegistry
import org.springframework.web.reactive.config.EnableWebFlux
import org.springframework.web.reactive.config.WebFluxConfigurer

@Configuration
@EnableScheduling
@EnableWebFlux
@EnableR2dbcRepositories
class AppConfig : WebFluxConfigurer {

    override fun addCorsMappings(registry: CorsRegistry) {
        // TODO: Revisit this to elaborate on the CORS protocol TO ALLOW ONLY VALID ACCESS FROM FRONT-END
        registry
            .addMapping("/**")
            .allowedHeaders("*")
            .allowedMethods("*")
            .allowedOrigins("*")
    }
}

//@Bean
//class
//fun initializer(connectionFactory: ConnectionFactory?): ConnectionFactoryInitializer? {
//    val initializer = ConnectionFactoryInitializer()
//    if (connectionFactory != null) {
//        initializer.setConnectionFactory(connectionFactory)
//    }
//    val populator = ResourceDatabasePopulator(ClassPathResource("sql/create.sql"))
//    initializer.setDatabasePopulator(populator)
//    return initializer
//}