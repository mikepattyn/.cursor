package httpapi

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"time"

	"example-calculator/internal/logging"
	"example-calculator/internal/store"
)

type Server struct {
	store *store.Store
	http  *http.Server
}

func New(addr string, st *store.Store) *Server {
	mux := http.NewServeMux()
	srv := &Server{store: st}
	mux.HandleFunc("GET /healthz", srv.health)
	mux.HandleFunc("GET /readyz", srv.ready)
	mux.HandleFunc("GET /value", srv.get)
	mux.HandleFunc("PUT /value", srv.put)
	srv.http = &http.Server{Addr: addr, Handler: loggingMiddleware(mux)}
	return srv
}

func (s *Server) ListenAndServe() error {
	return s.http.ListenAndServe()
}

func (s *Server) Shutdown(ctx context.Context) error {
	return s.http.Shutdown(ctx)
}

func (s *Server) health(w http.ResponseWriter, _ *http.Request) {
	writeJSON(w, http.StatusOK, map[string]string{"status": "ok"})
}

func (s *Server) ready(w http.ResponseWriter, _ *http.Request) {
	if err := s.store.Ready(); err != nil {
		writeJSON(w, http.StatusServiceUnavailable, map[string]string{"status": "unavailable"})
		return
	}
	writeJSON(w, http.StatusOK, map[string]string{"status": "ok"})
}

func (s *Server) get(w http.ResponseWriter, _ *http.Request) {
	value, err := s.store.Get()
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "read failed"})
		return
	}
	writeJSON(w, http.StatusOK, value)
}

func (s *Server) put(w http.ResponseWriter, r *http.Request) {
	var body struct {
		Value float64 `json:"value"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid body"})
		return
	}
	value, err := s.store.Put(body.Value)
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "write failed"})
		return
	}
	writeJSON(w, http.StatusOK, value)
}

func writeJSON(w http.ResponseWriter, status int, payload any) {
	w.Header().Set("content-type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(payload)
}

func loggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		logging.Info("request", map[string]any{"method": r.Method, "path": r.URL.Path})
		next.ServeHTTP(w, r)
	})
}

func ShutdownWait() (context.Context, context.CancelFunc) {
	return context.WithTimeout(context.Background(), 10*time.Second)
}

func IsClosed(err error) bool {
	return errors.Is(err, http.ErrServerClosed)
}
