# Estágio 1 — Build
FROM eclipse-temurin:17 AS build

WORKDIR /app

COPY . .

RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests

# Estágio 2 — Imagem final (só o necessário pra rodar)
FROM eclipse-temurin:17-jre

WORKDIR /app

COPY --from=build /app/target/backend-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]