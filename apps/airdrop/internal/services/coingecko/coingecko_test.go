package coingecko_test

import (
	"context"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/fair-meme/fairmeme/apps/airdrop/internal/services/coingecko"
)

func TestCall(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		switch r.URL.Path {
		case "/coins/list":
			_, _ = w.Write([]byte(`[
				{"id":"jupiter","symbol":"jup","name":"Jupiter","platforms":{"solana":"JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN"}}
			]`))
		case "/coins/markets":
			_, _ = w.Write([]byte(`[
				{"id":"solana","current_price":180.5,"market_cap_rank":5},
				{"id":"jupiter","current_price":1.25,"market_cap_rank":80}
			]`))
		default:
			http.NotFound(w, r)
		}
	}))
	defer server.Close()

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	client, err := coingecko.NewClient(ctx, slog.Default(), server.URL, "test-api-key")
	if err != nil {
		t.Fatal(err)
	}

	prices := client.GetTokenPrices([]string{"SOL", "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN"})
	if len(prices) != 2 {
		t.Fatalf("expected 2 prices, got %d: %#v", len(prices), prices)
	}

	priceByAddress := map[string]float64{}
	for _, item := range prices {
		priceByAddress[item.Address] = item.Price
	}
	if priceByAddress["SOL"] != 180.5 {
		t.Fatalf("unexpected SOL price: %f", priceByAddress["SOL"])
	}
	if priceByAddress["JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN"] != 1.25 {
		t.Fatalf("unexpected JUP price: %f", priceByAddress["JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN"])
	}
}
