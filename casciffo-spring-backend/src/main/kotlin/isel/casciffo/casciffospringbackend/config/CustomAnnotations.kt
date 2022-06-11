package isel.casciffo.casciffospringbackend.config

import isel.casciffo.casciffospringbackend.common.CA_AUTHORITY
import isel.casciffo.casciffospringbackend.common.FINANCE_AUTHORITY
import isel.casciffo.casciffospringbackend.common.SUPERUSER_AUTHORITY
import isel.casciffo.casciffospringbackend.common.UIC_AUTHORITY
import org.springframework.security.access.prepost.PreAuthorize


@Target(AnnotationTarget.FUNCTION)
@Retention(AnnotationRetention.RUNTIME)
@PreAuthorize("hasAuthority('${SUPERUSER_AUTHORITY}')")
annotation class IsSuperuser


@Target(AnnotationTarget.FUNCTION)
@Retention(AnnotationRetention.RUNTIME)
@PreAuthorize("hasAnyAuthority('${SUPERUSER_AUTHORITY}', '${UIC_AUTHORITY}')")
annotation class IsUIC


@Target(AnnotationTarget.FUNCTION)
@Retention(AnnotationRetention.RUNTIME)
@PreAuthorize("hasAnyAuthority('${SUPERUSER_AUTHORITY}', '${CA_AUTHORITY}')")
annotation class IsCA


@Target(AnnotationTarget.FUNCTION)
@Retention(AnnotationRetention.RUNTIME)
@PreAuthorize("hasAnyAuthority('${SUPERUSER_AUTHORITY}', '${FINANCE_AUTHORITY}')")
annotation class IsFinance


@Target(AnnotationTarget.FUNCTION)
@Retention(AnnotationRetention.RUNTIME)
@PreAuthorize("hasAnyAuthority('${SUPERUSER_AUTHORITY}', '${FINANCE_AUTHORITY}', '${UIC_AUTHORITY}')")
annotation class IsFinanceOrUIC