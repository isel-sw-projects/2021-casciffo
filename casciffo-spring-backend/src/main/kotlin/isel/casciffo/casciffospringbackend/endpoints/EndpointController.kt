package isel.casciffo.casciffospringbackend.endpoints

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.reactive.result.method.annotation.RequestMappingHandlerMapping

@RestController
@RequestMapping("/")
class EndpointController(
    @Autowired val handlerMapping: RequestMappingHandlerMapping
) {

    @GetMapping
    suspend fun getEndpoints(): Any? {
        return handlerMapping.handlerMethods.keys.stream().map { it.patternsCondition.patterns }
    }
}