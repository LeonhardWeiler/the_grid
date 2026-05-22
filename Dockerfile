FROM golang:1.26.2 AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -o the-grid main.go

FROM alpine:latest

WORKDIR /app

COPY --from=builder /app/the-grid .

EXPOSE 4000

VOLUME ["/data"]

CMD ["./the-grid"]
