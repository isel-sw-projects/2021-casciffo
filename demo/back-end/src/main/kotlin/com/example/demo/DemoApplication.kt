package com.example.demo

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.method.HandlerMethod
import org.springframework.web.servlet.HandlerInterceptor
import org.springframework.web.servlet.config.annotation.CorsRegistry
import org.springframework.web.servlet.config.annotation.EnableWebMvc
import org.springframework.web.servlet.config.annotation.InterceptorRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

@Configuration
@EnableWebMvc
class ApiConfig : WebMvcConfigurer {
// future reference
//	override fun addInterceptors(registry: InterceptorRegistry) {
//		registry.addInterceptor(AuthorizationInterceptor())
//	}

	override fun addCorsMappings(registry: CorsRegistry) {
		registry
			.addMapping("/**")
			.allowedHeaders("*")
			.allowedMethods("*")
			.allowedOrigins("*")
	}
}

@SpringBootApplication
class DemoApplication

fun main(args: Array<String>) {
	runApplication<DemoApplication>(*args)
}