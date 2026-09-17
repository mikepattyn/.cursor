package main

import (
	"fmt"
	"os"
	"os/signal"
	"syscall"

	"example-calculator/internal/config"
	"example-calculator/internal/httpapi"
	"example-calculator/internal/logging"
	"example-calculator/internal/store"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		logging.Error("invalid config", map[string]any{"error": err.Error()})
		os.Exit(1)
	}
	st, err := store.Open(cfg.SQLitePath)
	if err != nil {
		logging.Error("open sqlite", map[string]any{"error": err.Error()})
		os.Exit(1)
	}
	defer st.Close()

	srv := httpapi.New(fmt.Sprintf("0.0.0.0:%d", cfg.Port), st)
	logging.Info("example-calculator listening", map[string]any{"port": cfg.Port})

	errCh := make(chan error, 1)
	go func() {
		errCh <- srv.ListenAndServe()
	}()

	sigs := make(chan os.Signal, 1)
	signal.Notify(sigs, syscall.SIGINT, syscall.SIGTERM)
	select {
	case sig := <-sigs:
		logging.Info("shutting down", map[string]any{"signal": sig.String()})
		ctx, cancel := httpapi.ShutdownWait()
		defer cancel()
		if err := srv.Shutdown(ctx); err != nil {
			logging.Error("shutdown failed", map[string]any{"error": err.Error()})
			os.Exit(1)
		}
	case err := <-errCh:
		if err != nil && !httpapi.IsClosed(err) {
			logging.Error("listen failed", map[string]any{"error": err.Error()})
			os.Exit(1)
		}
	}
}
