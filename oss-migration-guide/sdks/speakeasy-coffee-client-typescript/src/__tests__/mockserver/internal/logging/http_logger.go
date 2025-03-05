// Code generated by Speakeasy (https://speakeasy.com). DO NOT EDIT.

package logging

import (
	"context"
	"fmt"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"net/http/httputil"
)

// HTTPLoggerHandler wraps another [http.Handler] with logging output using the
// provided logger.
func HTTPLoggerHandler(logger *slog.Logger, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
		httpLogger := logger.WithGroup("http")
		recorder := httptest.NewRecorder()
		reqAttr := slog.Group(
			"request",
			slog.String("method", req.Method),
			slog.String("url", req.URL.RequestURI()),
		)

		if !logger.Enabled(context.Background(), slog.LevelDebug) {
			httpLogger.With(reqAttr).Info("received request")
			next.ServeHTTP(recorder, req)

			resp := recorder.Result()
			respAttr := slog.Group(
				"response",
				slog.String("status", resp.Status),
			)

			httpLogger.With(reqAttr).With(respAttr).Info("serving response")

			recorderToWriter(recorder, w)

			return
		}

		dump, err := httputil.DumpRequest(req, true)

		if err != nil {
			http.Error(w, fmt.Sprint(err), http.StatusInternalServerError)

			return
		}

		rawReqAttr := slog.Group(
			"request",
			slog.String("method", req.Method),
			slog.String("url", req.URL.RequestURI()),
			slog.String("raw", string(dump)),
		)

		httpLogger.With(rawReqAttr).Debug("received request")

		next.ServeHTTP(recorder, req)

		dump, err = httputil.DumpResponse(recorder.Result(), true)

		if err != nil {
			http.Error(w, fmt.Sprint(err), http.StatusInternalServerError)

			return
		}

		rawRespAttr := slog.Group(
			"response",
			slog.String("raw", string(dump)),
		)

		// Intentionally use simpler request log attributes
		httpLogger.With(reqAttr).With(rawRespAttr).Debug("serving response")

		recorderToWriter(recorder, w)
	})
}

// recorderToWriter copies the recorded response back to the writer.
func recorderToWriter(recorder *httptest.ResponseRecorder, w http.ResponseWriter) {
	for k, v := range recorder.Result().Header {
		w.Header()[k] = v
	}

	w.WriteHeader(recorder.Code)
	_, _ = recorder.Body.WriteTo(w)
}
