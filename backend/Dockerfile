# İki aşamalı derleme: makineye Java/Maven kurulmasına gerek yoktur.
# Aynı Dockerfile Windows ve macOS'ta aynı sonucu üretir.

FROM maven:3.9-eclipse-temurin-21 AS derleme
WORKDIR /kaynak

# Önce bağımlılıklar indirilir; pom değişmedikçe bu katman önbellekten gelir
COPY pom.xml .
RUN mvn -B dependency:go-offline

COPY src ./src
RUN mvn -B clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /uygulama

# Sağlık kontrolü için gerekli
RUN apk add --no-cache wget

COPY --from=derleme /kaynak/target/*.jar uygulama.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "uygulama.jar"]
