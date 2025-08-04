# Use official OpenJDK 17 slim image
FROM openjdk:17-jdk-slim

# Set working directory inside the container
WORKDIR /app

# Copy all project files
COPY . .

# Make the Maven wrapper executable (especially on Linux servers)
RUN chmod +x mvnw

# Build the project (clean + package)
RUN ./mvnw clean package -DskipTests

# Run the application
CMD ["java", "-jar", "target/blog-application-0.0.1-SNAPSHOT.jar"]
