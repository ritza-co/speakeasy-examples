// Code generated by Speakeasy (https://speakeasy.com). DO NOT EDIT.

package handler

import (
	"fmt"
	"log"
	"mockserver/internal/handler/assert"
	"mockserver/internal/logging"
	"mockserver/internal/sdk/models/components"
	"mockserver/internal/sdk/utils"
	"mockserver/internal/tracking"
	"net/http"
)

func pathPostOrders(dir *logging.HTTPFileDirectory, rt *tracking.RequestTracker) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {
		test := req.Header.Get("x-speakeasy-test-name")
		instanceID := req.Header.Get("x-speakeasy-test-instance-id")

		count := rt.GetRequestCount(test, instanceID)

		switch fmt.Sprintf("%s[%d]", test, count) {
		case "create_order_orders_post-simple_order[0]":
			dir.HandlerFunc("create_order_orders_post", testCreateOrderOrdersPostCreateOrderOrdersPostSimpleOrder0)(w, req)
		case "create_order_orders_post-complex_order[0]":
			dir.HandlerFunc("create_order_orders_post", testCreateOrderOrdersPostCreateOrderOrdersPostComplexOrder0)(w, req)
		default:
			http.Error(w, fmt.Sprintf("Unknown test: %s[%d]", test, count), http.StatusBadRequest)
		}
	}
}

func testCreateOrderOrdersPostCreateOrderOrdersPostSimpleOrder0(w http.ResponseWriter, req *http.Request) {
	if err := assert.ContentType(req, "application/json", true); err != nil {
		log.Printf("assertion error: %s\n", err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	if err := assert.AcceptHeader(req, []string{"application/json"}); err != nil {
		log.Printf("assertion error: %s\n", err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	if err := assert.HeaderExists(req, "User-Agent"); err != nil {
		log.Printf("assertion error: %s\n", err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	respBody := &components.CoffeeOrder{
		ID:           6,
		CustomerName: "Grace",
		CoffeeType:   "Cold Brew",
		Size:         "Medium",
		Extras: []string{
			"Vanilla syrup",
		},
		Price: 5.5,
	}
	respBodyBytes, err := utils.MarshalJSON(respBody, "", true)

	if err != nil {
		http.Error(
			w,
			"Unable to encode response body as JSON: "+err.Error(),
			http.StatusInternalServerError,
		)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	_, _ = w.Write(respBodyBytes)
}

func testCreateOrderOrdersPostCreateOrderOrdersPostComplexOrder0(w http.ResponseWriter, req *http.Request) {
	if err := assert.ContentType(req, "application/json", true); err != nil {
		log.Printf("assertion error: %s\n", err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	if err := assert.AcceptHeader(req, []string{"application/json"}); err != nil {
		log.Printf("assertion error: %s\n", err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	if err := assert.HeaderExists(req, "User-Agent"); err != nil {
		log.Printf("assertion error: %s\n", err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	respBody := &components.CoffeeOrder{
		ID:           5,
		CustomerName: "Eve",
		CoffeeType:   "Mocha",
		Size:         "Large",
		Extras: []string{
			"Whipped cream",
			"Chocolate syrup",
		},
		Price: 6,
	}
	respBodyBytes, err := utils.MarshalJSON(respBody, "", true)

	if err != nil {
		http.Error(
			w,
			"Unable to encode response body as JSON: "+err.Error(),
			http.StatusInternalServerError,
		)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	_, _ = w.Write(respBodyBytes)
}
