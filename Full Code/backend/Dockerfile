# Use OpenJDK 17 with Maven for building
FROM maven:3.8.1-openjdk-17 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the Maven configuration file first to leverage Docker layer caching
COPY pom.xml .

# Download dependencies to speed up future builds
RUN mvn dependency:go-offline

# Copy the rest of the project files
COPY src ./src

# Build the application, skipping tests for faster build
RUN mvn clean package -DskipTests

# Use a lightweight JDK image for running the application
FROM openjdk:17-slim

WORKDIR /app

# Copy the built JAR from the build stage
COPY --from=build /app/target/backend-0.0.1-SNAPSHOT.jar .

# Expose the port your Spring Boot application runs on
EXPOSE 8080

# Command to run the application
ENTRYPOINT ["java", "-jar", "backend-0.0.1-SNAPSHOT.jar"]
