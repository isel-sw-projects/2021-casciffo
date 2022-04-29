package isel.casciffo.casciffospringbackend

import isel.casciffo.casciffospringbackend.users.UserService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Component
import org.springframework.web.reactive.config.CorsRegistry
import org.springframework.web.reactive.config.EnableWebFlux
import org.springframework.web.reactive.config.WebFluxConfigurer
import org.springframework.web.server.ServerWebExchange
import org.springframework.web.server.WebFilter
import org.springframework.web.server.WebFilterChain
import reactor.core.publisher.Mono

//@Configuration
//@EnableWebFlux
//class ApiConfig : WebFluxConfigurer {
//
//    override fun addCorsMappings(registry: CorsRegistry) {
//        // TODO: Revisit this to elaborate on the CORS protocol TO ALLOW ONLY VALID ACCESS FROM FRONT-END
//        registry
//            .addMapping("/**")
//            .allowedHeaders("*")
//            .allowedMethods("*")
//            .allowedOrigins("*")
//    }
//}
//
////TODO MAYBE ADD MORE FILTERS TO MANAGE THE PERMISSIONS DEPENDING ON PATH AND USER ROLE
//@Component
//class AuthorizationWebFilter(
//    @Autowired val userService: UserService
//) : WebFilter {
//    override fun filter(exchange: ServerWebExchange, chain: WebFilterChain): Mono<Void> {
//        val auth = exchange.request.headers["Authorization"]
//        val allowedPaths = listOf("/users")
//        //exchange.session.map { it. }
//        //basically all paths besides registering user and homepage require sign in so need to check if superuser role
//        return if (allowedPaths.contains(exchange.request.path.toString())) {
//            chain.filter(exchange)
//        } else {
//            if (auth.isNullOrEmpty()) {
//                exchange.response.statusCode = HttpStatus.UNAUTHORIZED
//            }
//            // use json-web tokens
//            exchange.response.setComplete()
//        }
//    }
//}
