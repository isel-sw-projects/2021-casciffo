package isel.casciffo.casciffospringbackend

//@Configuration
//@EnableWebFluxSecurity
//open class MultiSecurityHttpConfig {
//    @Order(Ordered.HIGHEST_PRECEDENCE)
//    @Bean
//    open fun apiHttpSecurity(http: ServerHttpSecurity): SecurityWebFilterChain {
//        return http {
//            securityMatcher(PathPatternParserServerWebExchangeMatcher("/api/**"))
//            authorizeExchange {
//                authorize(anyExchange, authenticated)
//            }
//            oauth2ResourceServer {
//                jwt { }
//            }
//        }
//    }
//
//    @Bean
//    open fun webHttpSecurity(http: ServerHttpSecurity): SecurityWebFilterChain {
//        return http {
//            authorizeExchange {
//                authorize(anyExchange, authenticated)
//            }
//            httpBasic { }
//        }
//    }
//
//    @Bean
//    open fun userDetailsService(): ReactiveUserDetailsService {
//        return MapReactiveUserDetailsService(
//            PasswordEncodedUser.user(), PasswordEncodedUser.admin()
//        )
//    }
//}