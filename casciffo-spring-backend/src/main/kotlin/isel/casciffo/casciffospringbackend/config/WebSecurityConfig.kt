package isel.casciffo.casciffospringbackend.config

import isel.casciffo.casciffospringbackend.common.*
import isel.casciffo.casciffospringbackend.endpoints.*
import isel.casciffo.casciffospringbackend.exceptions.CustomAuthenticationDeniedHandler
import isel.casciffo.casciffospringbackend.exceptions.CustomAuthenticationEntryPoint
import isel.casciffo.casciffospringbackend.security.JwtAuthenticationManager
import isel.casciffo.casciffospringbackend.security.JwtServerAuthenticationConverter
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
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
//@EnableWebFluxSecurity
//@EnableGlobalMethodSecurity(prePostEnabled = true) allows PreAuthorize()
class WebSecurityConfig {


    @Bean
    fun passwordEncoder(): PasswordEncoder = BCryptPasswordEncoder()


    @Bean
    fun springSecurityFilterChain(
        converter: JwtServerAuthenticationConverter,
        http: ServerHttpSecurity,
        authManager: JwtAuthenticationManager,
        authEntryPoint: CustomAuthenticationEntryPoint,
        authExceptionHandler: CustomAuthenticationDeniedHandler
    ): SecurityWebFilterChain {

        val filter = AuthenticationWebFilter(authManager)
        filter.setServerAuthenticationConverter(converter)

        http
            .cors()
            .and()
            //Work around to disabling spring web session
            //see https://stackoverflow.com/questions/56056404/disable-websession-creation-when-using-spring-security-with-spring-webflux
            .requestCache()
            .requestCache(NoOpServerRequestCache.getInstance())
            .and()
            .securityContextRepository(NoOpServerSecurityContextRepository.getInstance())
            //handling default unauthorized exception, show the user that auth is made with Bearer token
            .exceptionHandling()
            // configure response body, see https://stackoverflow.com/questions/45211431/webexceptionhandler-how-to-write-a-body-with-spring-webflux
            .authenticationEntryPoint(authEntryPoint)
            .accessDeniedHandler(authExceptionHandler)
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

        statesRoutesAuth(http)
        usersRoutesAuth(http)
        rolesRoutesAuth(http)
        constantsRoutesAuth(http)
        proposalRoutesAuth(http)
        commentsRoutesAuth(http)
        researchRoutesAuth(http)

        return http.build()
    }


    private fun statesRoutesAuth(http: ServerHttpSecurity) {
        http
            .authorizeExchange()
            .pathMatchers(HttpMethod.GET, STATES_URL, STATES_CHAIN_TYPE_URL).authenticated()
            .pathMatchers(HttpMethod.OPTIONS, STATES_URL, STATES_CHAIN_TYPE_URL).authenticated()
    }

    private fun usersRoutesAuth(http: ServerHttpSecurity) {
        http
            .authorizeExchange()
            .pathMatchers(HttpMethod.POST, LOGIN_URL, REGISTER_URL).permitAll()
            .pathMatchers(HttpMethod.GET, USERS_URL).hasAuthority(SUPERUSER_AUTHORITY)
            .pathMatchers(HttpMethod.DELETE, USER_DETAIL_URL).hasAuthority(SUPERUSER_AUTHORITY)
            .pathMatchers(HttpMethod.POST, REGISTER_USER_SEPARATE_URL).hasAnyAuthority(SUPERUSER_AUTHORITY)
            .pathMatchers(USER_DETAIL_URL, USER_SEARCH_URL).authenticated()
            .pathMatchers(HttpMethod.PUT, USER_ROLES_URL).hasAuthority(SUPERUSER_AUTHORITY)
    }

    private fun rolesRoutesAuth(http: ServerHttpSecurity) {
        http
            .authorizeExchange()
            .pathMatchers(HttpMethod.GET, ROLES_URL).permitAll()
            .pathMatchers(HttpMethod.POST, ROLES_URL).hasAuthority(SUPERUSER_AUTHORITY)
            .pathMatchers(HttpMethod.DELETE, ROLE_DELETE_URL).hasAuthority(SUPERUSER_AUTHORITY)
    }

    private fun constantsRoutesAuth(http: ServerHttpSecurity) {
        http
            .authorizeExchange()
            .pathMatchers(HttpMethod.GET, CONSTANTS_URL).permitAll()
            .pathMatchers(HttpMethod.POST, "$CONSTANTS_URL/*").hasAuthority(SUPERUSER_AUTHORITY)
    }

    private fun proposalRoutesAuth(http: ServerHttpSecurity) {
        http
            .authorizeExchange()
            .pathMatchers("$PROPOSALS_URL/**").authenticated()
            .pathMatchers(HttpMethod.POST, PROPOSALS_URL, PROPOSAL_EVENTS_URL).hasAnyAuthority(SUPERUSER_AUTHORITY, UIC_AUTHORITY)
            .pathMatchers(HttpMethod.PATCH, PROPOSALS_URL, PROPOSAL_EVENTS_URL).hasAnyAuthority(SUPERUSER_AUTHORITY, UIC_AUTHORITY)
            .pathMatchers(HttpMethod.PUT, PROPOSAL_TRANSITION_CA_URL).hasAnyAuthority(SUPERUSER_AUTHORITY, CA_AUTHORITY)
            .pathMatchers(HttpMethod.PUT, PROPOSAL_TRANSITION_SUPERUSER_URL).hasAnyAuthority(SUPERUSER_AUTHORITY)
            .pathMatchers(HttpMethod.PUT, PROPOSAL_TRANSITION_UIC_URL).hasAnyAuthority(SUPERUSER_AUTHORITY, UIC_AUTHORITY)
            .pathMatchers(HttpMethod.PUT, PROPOSAL_FINANCE_VALIDATION_URL).hasAnyAuthority(SUPERUSER_AUTHORITY, FINANCE_AUTHORITY)
            .pathMatchers(HttpMethod.PUT, PROPOSAL_JURIDICAL_VALIDATION_URL).hasAnyAuthority(SUPERUSER_AUTHORITY, JURIDICAL_AUTHORITY)
            .pathMatchers(HttpMethod.PUT, PROPOSAL_PROTOCOL_URL).hasAnyAuthority(SUPERUSER_AUTHORITY, UIC_AUTHORITY)
            .pathMatchers(HttpMethod.POST, PROPOSAL_FINANCIAL_FILE_UPLOAD_URL).hasAnyAuthority(SUPERUSER_AUTHORITY, UIC_AUTHORITY)
            .pathMatchers(HttpMethod.GET, PROPOSAL_FINANCIAL_FILE_DOWNLOAD_URL).authenticated()
            .pathMatchers(HttpMethod.GET, NEAREST_EVENTS_URL).authenticated()
    }

    private fun commentsRoutesAuth(http: ServerHttpSecurity) {
        http
            .authorizeExchange()
            .pathMatchers("$PROPOSAL_COMMENTS_URL/**").authenticated()
    }

    private fun researchRoutesAuth(http: ServerHttpSecurity) {
        http
            .authorizeExchange()
            .pathMatchers("$RESEARCH_URL/**").authenticated()
            .pathMatchers(HttpMethod.PUT, "$RESEARCH_DETAIL_URL/*").hasAnyAuthority(SUPERUSER_AUTHORITY, UIC_AUTHORITY)
            .pathMatchers(HttpMethod.POST, RESEARCH_CANCEL_URL, RESEARCH_COMPLETE_URL).hasAnyAuthority(SUPERUSER_AUTHORITY, UIC_AUTHORITY)
            .pathMatchers(HttpMethod.POST, RESEARCH_DOSSIER_URL).hasAnyAuthority(SUPERUSER_AUTHORITY, UIC_AUTHORITY)
            //research patients
            .pathMatchers(HttpMethod.GET, SEARCH_PATIENTS).hasAnyAuthority(SUPERUSER_AUTHORITY, UIC_AUTHORITY)
            .pathMatchers(HttpMethod.GET, RESEARCH_PATIENT_DETAILS).hasAnyAuthority(SUPERUSER_AUTHORITY, UIC_AUTHORITY)
            //research visits
            .pathMatchers(HttpMethod.POST, RESEARCH_VISIT_DETAIL_URL).hasAnyAuthority(SUPERUSER_AUTHORITY, UIC_AUTHORITY)
            //research finance
            .pathMatchers(HttpMethod.PUT, RESEARCH_FINANCE).hasAnyAuthority(SUPERUSER_AUTHORITY, UIC_AUTHORITY, FINANCE_AUTHORITY)
            .pathMatchers(HttpMethod.PUT, RESEARCH_FINANCE_RESEARCH_ENTRY).hasAnyAuthority(SUPERUSER_AUTHORITY, UIC_AUTHORITY, FINANCE_AUTHORITY)
            .pathMatchers(HttpMethod.PUT, RESEARCH_FINANCE_TEAM_ENTRY).hasAnyAuthority(SUPERUSER_AUTHORITY, UIC_AUTHORITY, FINANCE_AUTHORITY)
    }
}