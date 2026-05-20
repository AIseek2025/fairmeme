# Use Go 1.22.6 as the base image for building
FROM golang:1.22.6-alpine AS builder

# Set the working directory in the container
WORKDIR /app

# Copy go.mod and go.sum files (if they exist)
COPY go.mod go.sum* ./

# Download dependencies
RUN go mod download

# Copy the source code into the container
COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -o server ./cmd/server

# Use alpine as the base image for the final container to include necessary CA certificates
FROM alpine:latest

# Copy the compiled binary from the builder stage
COPY --from=builder /app/server /server

# Copy the configuration file
COPY config.toml /config.toml
COPY .env /.env

# Set the working directory in the final container
WORKDIR /

# Set the default port
ENV PORT=8080

# Expose the port the app runs on
EXPOSE $PORT

# Command to run the application
CMD ["/bin/sh", "-c", "/server"]