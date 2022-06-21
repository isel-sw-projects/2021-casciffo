package isel.casciffo.casciffospringbackend.config

import isel.casciffo.casciffospringbackend.common.CA_AUTHORITY
import isel.casciffo.casciffospringbackend.common.FINANCE_AUTHORITY
import isel.casciffo.casciffospringbackend.common.SUPERUSER_AUTHORITY
import isel.casciffo.casciffospringbackend.common.UIC_AUTHORITY
import isel.casciffo.casciffospringbackend.endpoints.*
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
            .pathMatchers(HttpMethod.GET, ENDPOINTS_URL).permitAll()
            .and()
            //jwt filter
            .addFilterAt(filter, SecurityWebFiltersOrder.AUTHENTICATION)
            .httpBasic().disable()
            .formLogin().disable()
            .logout().disable()
            .csrf().disable()

        usersRoutesAuth(http)
        rolesRoutesAuth(http)
        constantsRoutesAuth(http)
        proposalRoutesAuth(http)
        researchRoutesAuth(http)

        return http.build()
    }

    private fun usersRoutesAuth(http: ServerHttpSecurity) {
        http
            .authorizeExchange()
            .pathMatchers(HttpMethod.POST, LOGIN_URL, REGISTER_URL).permitAll()
            .pathMatchers(HttpMethod.GET, USERS_URL).hasAnyAuthority(SUPERUSER_AUTHORITY)
            .pathMatchers(USER_DETAIL_URL, USER_SEARCH_URL).authenticated()
    }

    private fun rolesRoutesAuth(http: ServerHttpSecurity) {
        http
            .authorizeExchange()
            .pathMatchers(HttpMethod.GET, ROLES_URL).permitAll()
            .pathMatchers(HttpMethod.POST, ROLES_URL).hasAnyAuthority(SUPERUSER_AUTHORITY)
            .pathMatchers(HttpMethod.DELETE, ROLES_URL).hasAnyAuthority(SUPERUSER_AUTHORITY)
    }

    private fun constantsRoutesAuth(http: ServerHttpSecurity) {
        http
            .authorizeExchange()
            .pathMatchers(HttpMethod.GET, CONSTANTS_URL).permitAll()
            .pathMatchers(HttpMethod.POST, "$CONSTANTS_URL/*").hasAnyAuthority(SUPERUSER_AUTHORITY)
    }

    private fun proposalRoutesAuth(http: ServerHttpSecurity) {
        http
            .authorizeExchange()
            .pathMatchers("$PROPOSALS_URL/**").authenticated()
            .pathMatchers(HttpMethod.POST, PROPOSALS_URL, PROPOSAL_EVENTS_URL).hasAnyAuthority(SUPERUSER_AUTHORITY, UIC_AUTHORITY)
            .pathMatchers(HttpMethod.PATCH, PROPOSALS_URL, PROPOSAL_EVENTS_URL).hasAnyAuthority(SUPERUSER_AUTHORITY, UIC_AUTHORITY)
            .pathMatchers(HttpMethod.PUT, PROPOSAL_TRANSITION_CA_URL).hasAnyAuthority(SUPERUSER_AUTHORITY, CA_AUTHORITY)
            .pathMatchers(HttpMethod.PUT, PROPOSAL_TRANSITION_FINANCE_URL).hasAnyAuthority(SUPERUSER_AUTHORITY, FINANCE_AUTHORITY)
            .pathMatchers(HttpMethod.PUT, PROPOSAL_TRANSITION_SUPERUSER_URL).hasAnyAuthority(SUPERUSER_AUTHORITY)
            .pathMatchers(HttpMethod.PUT, PROPOSAL_TRANSITION_UIC_URL).hasAnyAuthority(SUPERUSER_AUTHORITY, UIC_AUTHORITY)
    }

    private fun researchRoutesAuth(http: ServerHttpSecurity) {
    }

}