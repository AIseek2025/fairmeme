package airdrop

import (
	"context"
	"encoding/json"
	business "github.com/fair-meme/fairmeme/apps/airdrop/internal/business"
	"log/slog"
	"net/http"
)

type Server struct {
	ctx        context.Context
	addr       string
	logger     *slog.Logger
	httpServer *http.Server
	airdrop    Airdrop
	summary    *business.SummaryServer
}

func NewServer(ctx context.Context, logger *slog.Logger, addr string, airdrop Airdrop, summary *business.SummaryServer) (*Server, error) {
	s := &Server{
		ctx:     ctx,
		addr:    addr,
		logger:  logger,
		airdrop: airdrop,
		summary: summary,
	}
	return s, nil
}

func (s *Server) Start() error {
	mux := http.NewServeMux()
	mux.HandleFunc("/checkAirdrop", s.checkAirdropHandler)
	mux.HandleFunc("/inviteLogs", s.summary.InviteServer.GetInviteLogsHandler)
	mux.HandleFunc("/tradeLogs", s.summary.TradeServer.GetTradeLogsHandler)
	mux.HandleFunc("/updateTwScore", s.summary.UpdateTwScoreHandler)
	mux.HandleFunc("/getTwScore", s.summary.MemberServer.GetTwScoreHandler)
	mux.HandleFunc("/getSummary", s.summary.GetSummaryHandler)
	mux.HandleFunc("/getProgress", s.summary.GetProgress)
	mux.HandleFunc("/checkInviteCode", s.summary.MemberServer.CheckInviteCode)
	mux.HandleFunc("/getTwRank", s.summary.MemberServer.GetTwRankHandler)
	mux.HandleFunc("/getAirdropRank", s.summary.GetAirdropRankHandler)
	s.httpServer = &http.Server{
		Addr:    s.addr,
		Handler: mux,
	}
	return s.httpServer.ListenAndServe()
}

func (s *Server) checkAirdropHandler(w http.ResponseWriter, r *http.Request) {
	userAddress := r.URL.Query().Get("user_address")
	chainName := r.URL.Query().Get("chain")
	if userAddress == "" || chainName == "" {
		http.Error(w, "Missing user_address or chain_name", http.StatusBadRequest)
		return
	}
	result, err := s.airdrop.CheckAirdrop(userAddress, chainName)
	if err != nil {
		http.Error(w, "Error checking airdrop: "+err.Error(), http.StatusInternalServerError)
		return
	}

	response, err := json.Marshal(result)
	if err != nil {
		http.Error(w, "Error encoding response: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(response)
}
