FROM golang:1.26.2 AS builder

WORKDIR /app
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o the-grid .

FROM alpine:latest

WORKDIR /app

COPY --from=builder /app/the-grid /app/the-grid
COPY --from=builder /app/public/dist ./public/dist

EXPOSE 4000

CMD ["/app/the-grid"]
