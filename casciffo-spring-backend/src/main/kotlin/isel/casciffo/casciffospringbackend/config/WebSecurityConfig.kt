package isel.casciffo.casciffospringbackend.config

import isel.casciffo.casciffospringbackend.security.JwtAuthenticationManager
import isel.casciffo.casciffospringbackend.security.JwtServerAuthenticationConverter
import kotlinx.coroutines.reactor.mono
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpMethod
import org.springframework.http.HttpStatus
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity
import org.springframework.security.config.web.server.SecurityWebFiltersOrder
import org.springframework.security.config.web.server.ServerHttpSecurity
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.web.server.SecurityWebFilterChain
import org.springframework.security.web.server.authentication.AuthenticationWebFilter
import org.springframework.security.web.server.context.NoOpServerSecurityContextRepository
import org.springframework.security.web.server.savedrequest.NoOpServerRequestCache
import org.springframework.stereotype.Component


@Component

@Configuration
@EnableWebFluxSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
class WebSecurityConfig {


    @Bean
    fun passwordEncoder(): PasswordEncoder = BCryptPasswordEncoder()


    @Bean
    fun springSecurityFilterChain(
        converter: JwtServerAuthenticationConverter,
        http: ServerHttpSecurity,
        authManager: JwtAuthenticationManager
    ): SecurityWebFilterChain {

        val filter = AuthenticationWebFilter(authManager)
        filter.setServerAuthenticationConverter(converter)

        http
            //Work around to disabling spring web session
            //see https://stackoverflow.com/questions/56056404/disable-websession-creation-when-using-spring-security-with-spring-webflux
            .requestCache()
            .requestCache(NoOpServerRequestCache.getInstance())
            .and()
            .securityContextRepository(NoOpServerSecurityContextRepository.getInstance())
            //handling default unauthorized exception, show the user that auth is made with Bearer token
            .exceptionHandling()
            .authenticationEntryPoint { exchange, _ ->
                mono {
                    exchange.response.statusCode = HttpStatus.UNAUTHORIZED
                    exchange.response.headers.set(HttpHeaders.WWW_AUTHENTICATE, "Bearer")
                    null
                }
            }
            .and()
            .authorizeExchange()
            .pathMatchers(HttpMethod.POST, "/users/login", "/users/register").permitAll()
            .pathMatchers(HttpMethod.GET, "/*").permitAll()
            .anyExchange().authenticated()
            .and()
            .addFilterAt(filter, SecurityWebFiltersOrder.AUTHENTICATION)
            .httpBasic().disable()
            .formLogin().disable()
            .logout().disable()
            .csrf().disable()

        return http.build()
    }

}