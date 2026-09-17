package httpapi

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"strings"
	"testing"

	"example-calculator/internal/store"
)

func TestGetEmptyAndPut(t *testing.T) {
	dir := t.TempDir()
	st, err := store.Open(filepath.Join(dir, "calculator.db"))
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { _ = st.Close() })
	srv := New("127.0.0.1:0", st)

	rec := httptest.NewRecorder()
	srv.http.Handler.ServeHTTP(rec, httptest.NewRequest(http.MethodGet, "/value", nil))
	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", rec.Code)
	}
	var empty map[string]any
	if err := json.Unmarshal(rec.Body.Bytes(), &empty); err != nil {
		t.Fatal(err)
	}
	if empty["value"] != nil {
		t.Fatalf("expected empty value, got %#v", empty)
	}

	put := httptest.NewRecorder()
	req := httptest.NewRequest(http.MethodPut, "/value", strings.NewReader(`{"value":9}`))
	srv.http.Handler.ServeHTTP(put, req)
	if put.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d body=%s", put.Code, put.Body.String())
	}

	health := httptest.NewRecorder()
	srv.http.Handler.ServeHTTP(health, httptest.NewRequest(http.MethodGet, "/healthz", nil))
	if health.Code != http.StatusOK {
		t.Fatalf("health: %d", health.Code)
	}
}

func TestInvalidBody(t *testing.T) {
	dir := t.TempDir()
	st, err := store.Open(filepath.Join(dir, "calculator.db"))
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { _ = st.Close() })
	srv := New("127.0.0.1:0", st)
	rec := httptest.NewRecorder()
	req := httptest.NewRequest(http.MethodPut, "/value", strings.NewReader(`{`))
	srv.http.Handler.ServeHTTP(rec, req)
	if rec.Code != http.StatusBadRequest {
		t.Fatalf("expected 400, got %d", rec.Code)
	}
	_ = os.Stdout
}
