package isel.casciffo.casciffospringbackend.endpoints

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.reactive.result.method.annotation.RequestMappingHandlerMapping

data class Endpoint(val path: String)

@RestController
@RequestMapping(ENDPOINTS_URL)
class EndpointController(
    @Autowired val handlerMapping: RequestMappingHandlerMapping
) {

    //todo eventually add descriptions and allowed methods to each path
    @GetMapping
    suspend fun getEndpoints(): Any? {
        return handlerMapping
            .handlerMethods
            .keys
            .stream()
            .map {
                Endpoint(it.patternsCondition.patterns.first().patternString)
            }
            .distinct()
            .sorted(compareBy {
                it.path
            })

    }
}