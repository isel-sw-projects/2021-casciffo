import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
	id("org.springframework.boot") version "2.6.3"
	id("io.spring.dependency-management") version "1.0.11.RELEASE"
	kotlin("jvm") version "1.6.10"
	kotlin("plugin.spring") version "1.6.10"
}

group = "isel.casciffo"
version = "1.0.0-SNAPSHOT"
java.sourceCompatibility = JavaVersion.VERSION_17

repositories {
	mavenCentral()
}

dependencies {
	implementation("org.springframework.boot:spring-boot-starter-security")
	implementation("org.springframework.boot:spring-boot-starter-data-r2dbc:2.7.0")
	implementation("org.springframework.boot:spring-boot-starter-webflux:2.7.0")
	implementation("io.projectreactor.kotlin:reactor-kotlin-extensions:1.1.6")
	implementation("org.jetbrains.kotlinx:kotlinx-coroutines-reactor:1.6.2")
	implementation("org.jetbrains.kotlin:kotlin-reflect")
	implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8")

	implementation("io.github.microutils:kotlin-logging-jvm:2.1.23")

	runtimeOnly("io.r2dbc:r2dbc-postgresql:0.8.12.RELEASE")
	runtimeOnly("org.postgresql:postgresql:42.3.6")

	testImplementation("io.r2dbc:r2dbc-spi:1.0.0.RELEASE")
	testImplementation("com.h2database:h2:2.1.212")
	testImplementation("io.r2dbc:r2dbc-h2:0.9.1.RELEASE")
	testImplementation("org.springframework.boot:spring-boot-starter-test:2.7.0")
	testImplementation("io.projectreactor:reactor-test:3.4.18")
	testImplementation ("org.jetbrains.kotlinx:kotlinx-coroutines-test:1.6.2")

	//JWT
	implementation("io.jsonwebtoken:jjwt-api:0.11.5")
	runtimeOnly("io.jsonwebtoken:jjwt-impl:0.11.5")
	runtimeOnly("io.jsonwebtoken:jjwt-jackson:0.11.5")
}

tasks.withType<KotlinCompile> {
	kotlinOptions {
		freeCompilerArgs = listOf("-Xjsr305=strict")
		jvmTarget = "17"
	}
}

tasks.withType<Test> {
	useJUnitPlatform()
}

tasks {
	register("stage") {
		dependsOn(clean, bootJar)
		mustRunAfter(clean)
	}
}
